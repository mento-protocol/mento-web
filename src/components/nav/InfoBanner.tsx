export function InfoBanner() {
  return (
    <div className="w-full h-6 py-1 bg-gray-950 dark:bg-neutral-800 justify-center items-center inline-flex">
      <div className="justify-start items-start gap-1 inline-flex font-inter">
        <div className="text-gray-400 dark:text-neutral-400 text-[12px] font-normal leading-none">
          This app uses Mento version 2.
        </div>
        <a
          href="https://forum.celo.org/t/towards-mento-2-0/3473"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-[12px] font-medium leading-none"
        >
          Learn more about Mento versions.
        </a>
      </div>
    </div>
  )
}
