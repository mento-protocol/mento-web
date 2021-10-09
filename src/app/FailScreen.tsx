import Image from 'next/image'
import { Component } from 'react'
import { TextLink } from 'src/components/buttons/TextLink'
import SadFace from 'src/images/icons/sad_face.svg'
import Logo from 'src/images/logo.svg'
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

export function FailScreen({ details }: { details?: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen p-5">
      <div className="hidden sm:block fixed top-4 left-4">
        <Image src={Logo} alt="Mento.fi Logo" quality={100} width={60} height={60} />
      </div>
      <h1 className="text-2xl mb-2 text-center">Something went wrong, sorry!</h1>
      <Image src={SadFace} alt="Sad Face" width={175} height={230} />
      <h3 className="text-lg mt-2 text-center">
        Please refresh the page. If the problem persists, you can{' '}
        <TextLink href="TODO" className="underline">
          ask for help on Discord
        </TextLink>
        .
      </h3>
      {details && <p className="text-md text-center mt-6 text-gray-500">{details}</p>}
    </div>
  )
}
