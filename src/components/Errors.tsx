import Image from 'next/image'
import { Component } from 'react'
import { Fade } from 'src/components/animation/Fade'
import { TextLink } from 'src/components/buttons/TextLink'
import { links } from 'src/config/links'
import SadFace from 'src/images/icons/sad_face.svg'
import Logo from 'src/images/logos/mento-logo-black.svg'
import { logger } from 'src/utils/logger'

interface ErrorBoundaryState {
  error: any
  errorInfo: any
}

export class ErrorBoundary extends Component<any, ErrorBoundaryState> {
  constructor(props: any) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({
      error,
      errorInfo,
    })
    logger.error('Error caught by error boundary', error, errorInfo)
  }

  render() {
    const errorInfo = this.state.error || this.state.errorInfo
    if (errorInfo) {
      const details = errorInfo.message || JSON.stringify(errorInfo)
      return <FailScreen details={details.substr(0, 120)} />
    }
    return this.props.children
  }
}

function FailScreen({ details }: { details?: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gradient-linear">
      <div className="hidden sm:block fixed top-5 left-5">
        <Image src={Logo} alt="Mento" quality={100} width={120} />
      </div>
      <FailContent details={details} />
    </div>
  )
}

export function FailContent({ details }: { details?: string }) {
  return (
    <Fade show={true}>
      <div className="flex flex-col items-center justify-center p-5">
        <h1 className="text-2xl mb-2 text-center">Something went wrong, sorry!</h1>
        <Image src={SadFace} alt="Sad Face" width={150} height={200} />
        <h3 className="text-lg mt-2 text-center">
          Please refresh the page. If the problem persists, you can{' '}
          <TextLink href={links.discord} className="underline">
            ask for help on Discord
          </TextLink>
          .
        </h3>
        {details && <p className="text-md text-center mt-6 text-gray-500">{details}</p>}
      </div>
    </Fade>
  )
}
