export function InfoBanner() {
  return (
    <div className="z-20 inline-flex items-center justify-center w-full h-6 py-1 bg-gray-950 dark:bg-neutral-800">
      <div className="inline-flex items-start justify-start gap-1 font-inter">
        <div className="text-gray-400 dark:text-neutral-400 text-[12px] font-normal leading-none cursor-default">
          This app uses Mento V2 Learn more about{' '}
        </div>
        <a
          href="https://forum.celo.org/t/towards-mento-2-0/3473"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-[12px] font-medium leading-none"
        >
          Mento versions
        </a>
      </div>
    </div>
  )
}
