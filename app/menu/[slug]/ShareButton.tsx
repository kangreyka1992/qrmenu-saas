'use client'

export default function ShareButton({
  restaurantName,
  slug,
  primaryColor,
}: {
  restaurantName: string
  slug: string
  primaryColor: string
}) {
  function handleShare() {
    const url = `https://qrmenu-saas-six.vercel.app/menu/${slug}`

    if (navigator.share) {
      navigator.share({
        title: restaurantName,
        text: `Меню ${restaurantName}`,
        url: url,
      })
    } else {
      navigator.clipboard.writeText(url)
      alert('Ссылка скопирована')
    }
  }

  return (
    <button
      onClick={handleShare}
      className="py-3 font-bold rounded-xl text-center text-sm shadow-lg text-black"
      style={{
        background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
      }}
    >
      📤 Поделиться
    </button>
  )
}