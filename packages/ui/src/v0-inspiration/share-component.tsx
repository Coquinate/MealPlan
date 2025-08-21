import { useState } from "react"
import { IconShare2, IconBrandFacebook, IconMessageCircle, IconMail, IconCopy, IconCheck } from "@tabler/icons-react"

interface ShareComponentProps {
  title?: string
  description?: string
  url?: string
  className?: string
}

export function ShareComponent({
  title = "Coquinate - Spune adio întrebării „Ce mâncăm azi?”",
  description = "Descoperă planuri de mese inteligente care îți economisesc timp și bani. Gătești o dată, mănânci de trei ori!",
  url = typeof window !== "undefined" ? window.location.href : "",
  className = "",
}: ShareComponentProps) {
  const [copied, setCopied] = useState(false)

  const shareData = {
    title,
    text: description,
    url,
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log("Error sharing:", error)
      }
    }
  }

  const handleIconCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.log("Error copying:", error)
    }
  }

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${url}`)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`,
  }

  return (
    <div className={`${className}`}>
      <p className="text-xs font-semibold mb-3 text-center">
        Îți place ideea? Ajută-ne să ajungem la mai multe familii!
      </p>

      <div className="flex justify-center gap-3">
        {/* Native Share (mobile) */}
        {typeof window !== "undefined" && navigator.share && (
          <button
            onClick={handleNativeShare}
            className="flex items-center gap-2 px-3 py-2 bg-[var(--primary-warm)] text-white rounded-lg text-xs font-medium hover:bg-[var(--primary-warm-dark)] transition-colors duration-200"
          >
            <IconShare2 size={14} />
            Distribuie
          </button>
        )}

        {/* Facebook */}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 bg-[#1877F2] text-white rounded-lg text-xs font-medium hover:bg-[#166FE5] transition-colors duration-200"
        >
          <IconBrandFacebook size={14} />
          Facebook
        </a>

        {/* WhatsApp */}
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 bg-[#25D366] text-white rounded-lg text-xs font-medium hover:bg-[#22C55E] transition-colors duration-200"
        >
          <IconMessageCircle size={14} />
          WhatsApp
        </a>

        {/* Email */}
        <a
          href={shareLinks.email}
          className="flex items-center gap-2 px-3 py-2 bg-[var(--text-secondary)] text-white rounded-lg text-xs font-medium hover:bg-[var(--text-primary)] transition-colors duration-200"
        >
          <IconMail size={14} />
          Email
        </a>

        {/* IconCopy Link */}
        <button
          onClick={handleIconCopyLink}
          className="flex items-center gap-2 px-3 py-2 bg-[var(--surface-eggshell)] border border-[var(--border-light)] text-[var(--text-primary)] rounded-lg text-xs font-medium hover:bg-[var(--border-light)] transition-colors duration-200"
        >
          {copied ? <IconCheck size={14} className="text-green-600" /> : <IconCopy size={14} />}
          {copied ? "Copiat!" : "Copiază"}
        </button>
      </div>
    </div>
  )
}
