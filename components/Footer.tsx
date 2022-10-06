export default function Footer() {
  return (
    <div className="flex justify-center pt-6 text-sm text-center border-t border-black/10 dark:border-white/10">
      <span className="flex flex-row items-center space-x-2">
        <p>Built with</p>
        <a
          href="https://cosmology.tech/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/cosmology.webp"
            className="w-auto h-4 transition duration-150 transform cursor-pointer hover:scale-105"
          />
        </a>
      </span>
    </div>
  )
}
