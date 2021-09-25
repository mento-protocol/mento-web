import Image from 'next/image'
import Discord from 'src/images/logos/discord.svg'
import Github from 'src/images/logos/github.svg'
import Twitter from 'src/images/logos/twitter.svg'
import Youtube from 'src/images/logos/youtube.svg'

export function Footer() {
  return (
    <footer className="w-screen py-4 px-7">
      <div className="flex justify-between items-center">
        <div className="flex items-center opacity-90">
          <FooterIconLink to="https://twitter.com/CeloOrg" imgSrc={Twitter} alt="Twitter" />
          <FooterIconLink
            to="https://github.com/celo-tools/mento-fi"
            imgSrc={Github}
            alt="Github"
          />
          <FooterIconLink to="TODO" imgSrc={Discord} alt="Discord" />
          <FooterIconLink to="https://www.youtube.com/c/CeloOrg" imgSrc={Youtube} alt="Youtube" />
        </div>
        <div className="flex items-center">
          <div className="mr-4">789241</div>
          <div className="rounded-full w-4 h-4 bg-green"></div>
        </div>
      </div>
    </footer>
  )
}

export function FooterIconLink({
  to,
  imgSrc,
  alt,
  last,
}: {
  to: string
  imgSrc: any
  alt: string
  last?: boolean
}) {
  return (
    <a href={to} target="_blank" rel="noopener noreferrer" className={last ? '' : 'mr-5'}>
      <Image src={imgSrc} alt={alt} width={25} height={25} />
    </a>
  )
}
