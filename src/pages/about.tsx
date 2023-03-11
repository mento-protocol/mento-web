import Link from 'next/link'
import { TextLink } from 'src/components/buttons/TextLink'
import { config } from 'src/config/config'
import { links } from 'src/config/links'
import { FloatingBox } from 'src/layout/FloatingBox'
import { HrDivider } from 'src/layout/HrDivider'

export default function AboutPage() {
  const pClass = 'mt-4 text-sm leading-loose'
  return (
    <div className="flex justify-center items-center grow">
      <FloatingBox maxWidth="max-w-xl" classes="mb-2 mx-10 p-6">
        <h2 className="text-lg text-center font-medium">About Mento</h2>
        <p className={pClass}>
          Mento is a decentralized and transparent protocol that allows everyone to create and
          exchange stable value digital assets. For more details about how Mento works, see{' '}
          <TextLink href={links.docs} className="text-green-600">
            the documentation
          </TextLink>
          .
        </p>
        <HrDivider classes="mt-4" />
        <p className={pClass}>
          How to start exchanging Celo native assets:
          <ol className="list-inside list-decimal">
            <li>
              Tap <q>Connect</q> in the top-right and select your wallet
            </li>
            <li>
              Go to the{' '}
              <Link href="/" className="text-green-600">
                Swap
              </Link>{' '}
              tab
            </li>
            <li>
              Input the asset and amount. Tap <q>Continue</q> and confirm details
            </li>
          </ol>
        </p>
        <HrDivider classes="mt-4" />
        <p className={pClass}>
          This app is a free tool to facilitate use of the Mento Protocol. It was funded by the Celo
          Foundation and Mento Labs. For help, join the chat on{' '}
          <TextLink href={links.discord} className="text-green-600">
            Discord
          </TextLink>{' '}
          or view the source on{' '}
          <TextLink href={links.github} className="text-green-600">
            Github
          </TextLink>
          .
        </p>
        <p className="mt-4 text-xs text-center">{`Version: ${config.version || 'Unknown'}`}</p>
      </FloatingBox>
    </div>
  )
}
