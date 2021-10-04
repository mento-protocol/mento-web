import jazzicon from '@metamask/jazzicon'
import { CSSProperties, PureComponent } from 'react'
import { isValidAddress, normalizeAddress } from 'src/utils/addresses'

type Props = {
  address: string
  size?: number
  styles?: CSSProperties
}

function addressToSeed(address: string) {
  const addrStub = normalizeAddress(address).slice(2, 10)
  return parseInt(addrStub, 16)
}

export class Identicon extends PureComponent<Props> {
  render() {
    const { address, size: _size, styles } = this.props
    const size = _size ?? 34

    if (!isValidAddress(address)) return null

    const jazziconResult = jazzicon(size, addressToSeed(address))

    return (
      <div
        style={{ height: size, ...styles }}
        ref={(nodeElement) => {
          if (nodeElement) {
            nodeElement.innerHTML = ''
            nodeElement.appendChild(jazziconResult)
          }
        }}
      ></div>
    )
  }
}
