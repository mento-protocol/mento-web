export function InfoBanner() {
  return (
    <div className="block py-1.5 w-full text-white text-center text-sm bg-green-800 hover:bg-green-900 active:bg-green-950 ring-1 ring-inset ring-green-700 transition-all duration-300">
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
  )
}
