import BigNumber from 'bignumber.js'
import Image from 'next/image'
import { useState } from 'react'
import { NetworkModal } from 'src/components/nav/NetworkModal'
import { STALE_BLOCK_TIME } from 'src/config/consts'
import { links } from 'src/config/links'
import { BlockStub } from 'src/features/blocks/types'
import { useAppSelector } from 'src/features/store/hooks'
import Discord from 'src/images/logos/discord.svg'
import Github from 'src/images/logos/github.svg'
import Twitter from 'src/images/logos/twitter.svg'
import { useDarkMode } from 'src/styles/mediaQueries'
import { isStale } from 'src/utils/time'

export function Footer() {
  const { isDarkMode, setDarkMode } = useDarkMode()
  return (
    <footer className="relative z-10 w-screen py-4 px-7">
      <div className="flex justify-between items-center">
        <div className="flex items-center opacity-90">
          <FooterIconLink to={links.twitter} imgSrc={Twitter} alt="Twitter" />
          <FooterIconLink to={links.github} imgSrc={Github} alt="Github" />
          <FooterIconLink to={links.discord} imgSrc={Discord} alt="Discord" />
        </div>
        <div className="flex items-center opacity-90">
          Theme:
          <input type="checkbox" checked={isDarkMode} onChange={() => setDarkMode(!isDarkMode)} />
        </div>
        <BlockIndicator />
      </div>
    </footer>
  )
}

function FooterIconLink({
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

function BlockIndicator() {
  const latestBlock = useAppSelector((s) => s.block.latestBlock)

  const status = getStatusFromBlock(latestBlock)
  let summary = 'Connecting'
  let classColor = 'yellow-300'
  if (status === ConnStatus.Connected) {
    summary = latestBlock!.number.toString()
    classColor = 'green-600'
  } else if (status === ConnStatus.Stale) {
    summary = latestBlock!.number.toString()
  } else if (status === ConnStatus.NotConnected) {
    summary = 'Not Connected'
    classColor = 'red-600'
  }

  const [showNetworkModal, setShowNetworkModal] = useState(false)

  return (
    <>
      <button
        className="flex items-center hover:underline"
        onClick={() => setShowNetworkModal(true)}
      >
        <div className="mr-3 text-sm font-medium pt-px">{summary}</div>
        <div
          className={`rounded-full w-3.5 h-3.5 ${'bg-' + classColor} border-2 ${'border-' + classColor
            } border-opacity-50`}
        ></div>
        <div className="hidden bg-yellow-300 bg-red-600"></div>
      </button>
      {showNetworkModal && (
        <NetworkModal isOpen={showNetworkModal} close={() => setShowNetworkModal(false)} />
      )}
    </>
  )
}

enum ConnStatus {
  NotConnected = -1,
  Loading = 0,
  Stale = 1,
  Connected = 2,
}

function getStatusFromBlock(latestBlock: BlockStub | null | undefined): ConnStatus {
  if (latestBlock === undefined) return ConnStatus.Loading

  if (latestBlock && latestBlock.number > 0 && latestBlock.timestamp > 0) {
    if (!isStale(new BigNumber(latestBlock.timestamp).toNumber() * 1000, STALE_BLOCK_TIME)) {
      return ConnStatus.Connected
    } else {
      return ConnStatus.Stale
    }
  }

  return ConnStatus.NotConnected
}
