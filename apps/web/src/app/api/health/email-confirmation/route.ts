import { NextResponse } from 'next/server'

// GET /api/health/email-confirmation
// Verifies Edge Function auth without sending an email by purposely failing
// validation AFTER auth (short token). Returns auth status and function code.
export async function GET() {
  const edgeBase = process.env.NEXT_PUBLIC_SUPABASE_URL
  const functionSecret = process.env.CONFIRMATION_EMAIL_FN_SECRET

  if (!edgeBase) {
    return NextResponse.json(
      { ok: false, error: 'NEXT_PUBLIC_SUPABASE_URL not configured' },
      { status: 500 },
    )
  }

  if (!functionSecret) {
    return NextResponse.json(
      { ok: false, error: 'CONFIRMATION_EMAIL_FN_SECRET not configured on server' },
      { status: 500 },
    )
  }

  const url = `${edgeBase}/functions/v1/send-confirmation-email`

  // Use a short token so auth passes but validation fails (no email is sent)
  const body = {
    email: 'healthcheck@example.com',
    confirmationToken: 'short',
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000) // 10s

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Required by Supabase Edge Functions gateway
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
        'x-function-secret': functionSecret,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    // If auth is OK, the function should return 400 for invalid token
    const authOk = res.status !== 401
    const result = {
      ok: authOk,
      functionStatus: res.status,
      message:
        res.status === 400
          ? 'Auth OK, validation failed as expected'
          : res.status === 200
            ? 'Unexpected 200 – function attempted to send email'
            : res.status === 401
              ? 'Unauthorized – check secret parity in hosting env'
              : `Function responded with status ${res.status}`,
    }

    return NextResponse.json(result, { status: authOk ? 200 : 502 })
  } catch (err) {
    clearTimeout(timeout)
    const message = err instanceof Error ? err.message : String(err)
    const isAbort = err instanceof Error && err.name === 'AbortError'
    return NextResponse.json(
      {
        ok: false,
        error: isAbort ? 'Timed out after 10s' : message,
      },
      { status: 504 },
    )
  }
}
