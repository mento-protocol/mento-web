export function InfoBanner() {
  return (
    <div className="z-20 inline-flex items-center justify-center w-full h-6 py-1 bg-gray-950 dark:bg-neutral-800">
      <div className="inline-flex items-start justify-start gap-1 font-inter">
        <span className="cursor-default">
        This app uses Mento V2, which includes trading limits. Learn more about{' '}
      </span>
      <a
        href="https://forum.celo.org/t/towards-mento-2-0/3473"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2"
      >
        Mento versions
      </a>{' '}
      and{' '}
      {/* TODO: This temporarily links to Oleksiys explanation of the trading limits in support channel. 
          Should link to docs once error message is more user friendly */}
      <a
        href="https://discord.com/channels/966739027782955068/1063035880069148703/1124285090390868060"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2"
      >
        trading limits.
      </a>
      </div>
    </div>
  )
}
