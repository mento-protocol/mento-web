import BigNumber from 'bignumber.js'
import cx from 'classnames'
import Image from 'next/image'
import { useState } from 'react'
import { NetworkModal } from 'src/components/nav/NetworkModal'
import { STALE_BLOCK_TIME } from 'src/config/consts'
import { links } from 'src/config/links'
import { BlockStub } from 'src/features/blocks/types'
import { useAppSelector } from 'src/features/store/hooks'
import Moon from 'src/images/icons/moon.svg'
import Sun from 'src/images/icons/sun.svg'
import Discord from 'src/images/logos/discord.svg'
import Github from 'src/images/logos/github.svg'
import Twitter from 'src/images/logos/twitter.svg'
import { useDarkMode } from 'src/styles/mediaQueries'
import { isStale } from 'src/utils/time'

export function Footer() {
  // const { isDarkMode, setDarkMode } = useDarkMode()
  // return (
  //   <footer className="relative z-10 w-screen py-4 px-7">
  //     <div className="flex justify-between items-center">
  //       <div className="flex items-center opacity-90">
  //         <FooterIconLink to={links.twitter} imgSrc={Twitter} alt="Twitter" />
  //         <FooterIconLink to={links.github} imgSrc={Github} alt="Github" />
  //         <FooterIconLink to={links.discord} imgSrc={Discord} alt="Discord" />
  //       </div>
  //       <div className="flex items-center opacity-90">
  //         Dark Mode:
  //         <input type="checkbox" checked={isDarkMode} onChange={() => setDarkMode(!isDarkMode)} />
  //       </div>
  //       <BlockIndicator />
  //     </div>
  //   </footer>
  // )
  return (
    <div className="w-full inline-flex justify-between p-3 sm:px-5 sm:py-7">
      <div className="justify-start items-start gap-4 inline-flex">
        <div className="p-2 justify-start items-start gap-2.5 flex">
          <FooterIconLink to={links.twitter} imgSrc={Twitter} alt="Twitter" />
        </div>
        <div className="p-2 justify-start items-start gap-2.5 flex">
          <FooterIconLink to={links.github} imgSrc={Github} alt="Github" />
        </div>
        <div className="p-2 justify-start items-start gap-2.5 flex">
          <FooterIconLink to={links.discord} imgSrc={Discord} alt="Discord" />
        </div>
      </div>
      <ThemeToggle />
      <BlockIndicator />
    </div>
  )
}

function ThemeToggle() {
  const { isDarkMode, setDarkMode } = useDarkMode()
  return (
    <div
      className="justify-start items-center gap-3 inline-flex cursor-pointer"
      onClick={() => setDarkMode(!isDarkMode)}
    >
      <div className="text-gray-950 dark:text-neutral-400 text-[15px] font-normal leading-tight">
        Theme
      </div>
      <div className="trainsition-color relative px-0.5 py-[1px] dark:bg-fuchsia-200 rounded-[32px] border border border border border-gray-950 justify-center items-center gap-[5px] flex">
        <div className="w-4 h-5 p-1 pr-0 relative flex-col justify-start items-start flex">
          <Image src={Sun} alt="light theme icon" width={14} height={14} />
        </div>
        <div className="w-4 h-5 py-1 pr-1 relative flex-col justify-start items-start flex">
          <Image src={Moon} alt="dark theme icon" width={14} height={14} />
        </div>
        <div
          className={cx(
            'absolute transition transform',
            'left-[2px] w-[18px] h-[18px]',
            'bg-gray-950 rounded-full border border-gray-950',
            {
              ['translate-x-[19px]']: !isDarkMode,
            }
          )}
        />
      </div>
    </div>
  )
}

function FooterIconLink({ to, imgSrc, alt }: { to: string; imgSrc: any; alt: string }) {
  return (
    <a className="w-6 h-6 relative dark:invert" href={to} target="_blank" rel="noopener noreferrer">
      <Image src={imgSrc} alt={alt} width={25} height={25} />
    </a>
  )
}

function BlockIndicator() {
  const latestBlock = useAppSelector((s) => s.block.latestBlock)

  const status = getStatusFromBlock(latestBlock)
  let summary = 'Connecting'
  let classColor = 'bg-yellow-300'
  if (status === ConnStatus.Connected) {
    summary = latestBlock!.number.toString()
    classColor = 'bg-emerald-500'
  } else if (status === ConnStatus.Stale) {
    summary = latestBlock!.number.toString()
  } else if (status === ConnStatus.NotConnected) {
    summary = 'Not Connected'
    classColor = 'bg-red-600'
  }

  const [showNetworkModal, setShowNetworkModal] = useState(false)

  /*
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

  */

  return (
    <>
      <button
        onClick={() => setShowNetworkModal(true)}
        className="px-2.5 h-7 mt-2 bg-gray-100 dark:bg-neutral-800 rounded-[100px] justify-end items-center gap-1.5 inline-flex"
      >
        <div className="text-right text-gray-950 dark:text-white text-[15px] font-normal leading-tight">
          {summary}
        </div>
        <div className={cx("w-2 h-2 relative bg-emerald-500 rounded-[100px]", classColor)} />
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
