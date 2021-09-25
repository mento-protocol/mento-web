import Image from 'next/image'
import { TextLink } from 'src/components/buttons/TextLink'
import Support from 'src/images/icons/support-coin.png'
import { FloatingBox } from 'src/layout/FloatingBox'

export default function GrandaPage() {
  return (
    <div className="flex justify-center items-center flex-grow">
      <FloatingBox maxWidth="max-w-md" classes="mb-12 mx-10 flex flex-col items-center">
        <h2 className="text-lg text-center font-medium">Granda Mento Coming Soon!</h2>
        <p className="mt-5 text-center leading-relaxed">
          Suport for Granda Mento is in progress! Check back here in a few weeks or join the{' '}
          <TextLink href="TODO" className="text-green">
            Discord
          </TextLink>{' '}
          for updates.
        </p>
        <Image src={Support} alt="Building" width={250} height={250} />
      </FloatingBox>
    </div>
  )
}
