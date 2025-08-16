import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify admin authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Verify user is admin
    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check admin status
    const { data: adminUser, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('id, role')
      .eq('user_id', user.id)
      .single();

    if (adminError || !adminUser) {
      return new Response(JSON.stringify({ error: 'Not authorized as admin' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const recipeId = formData.get('recipeId') as string;
    const operation = formData.get('operation') as string;

    if (operation === 'delete') {
      // Handle image deletion
      const imageUrl = formData.get('imageUrl') as string;

      if (imageUrl && imageUrl.includes('.supabase.co/storage/v1/object/public/recipe-images/')) {
        const pathMatch = imageUrl.match(/recipe-images\/(.+)$/);
        if (pathMatch) {
          const filePath = pathMatch[1];
          const { error: deleteError } = await supabaseAdmin.storage
            .from('recipe-images')
            .remove([filePath]);

          if (deleteError) {
            throw deleteError;
          }
        }
      }

      // Update database
      const { error: updateError } = await supabaseAdmin
        .from('recipes')
        .update({ image_url: null })
        .eq('id', recipeId);

      if (updateError) {
        throw updateError;
      }

      return new Response(JSON.stringify({ success: true, message: 'Image deleted' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle image upload
    if (!file || !recipeId) {
      return new Response(JSON.stringify({ error: 'Missing file or recipeId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: 'File too large. Maximum 5MB' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'Invalid file type' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate unique filename
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const fileName = `${recipeId}/${timestamp}.${fileExt}`;

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('recipe-images')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('recipe-images').getPublicUrl(fileName);

    // Update database
    const { error: updateError } = await supabaseAdmin
      .from('recipes')
      .update({ image_url: publicUrl })
      .eq('id', recipeId);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: publicUrl,
        message: 'Image uploaded successfully',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
