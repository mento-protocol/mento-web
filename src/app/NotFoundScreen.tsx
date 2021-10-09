import Image from 'next/image'
import Link from 'next/link'
import { Fade } from 'src/components/animation/Fade'
import NotFoundIcon from 'src/images/icons/not_found.svg'

export function NotFoundScreen() {
  return (
    <Fade show={true}>
      <div className="flex flex-col items-center justify-center p-5">
        <h1 className="text-2xl mb-8 text-center">This page could not be found, sorry!</h1>
        <Image src={NotFoundIcon} alt="Not Found" width={150} height={150} />
        <h3 className="text-lg mt-8 text-center">
          Please check the URL or go{' '}
          <Link href="/">
            <a className="cursor-pointer underline">back to home</a>
          </Link>
          .
        </h3>
      </div>
    </Fade>
  )
}
