import { IconButton, IconButtonProps } from 'src/components/buttons/IconButton'
import LeftArrow from 'src/images/icons/arrow-left-circle.svg'

export function BackButton(props: IconButtonProps) {
  return <IconButton imgSrc={LeftArrow} title="Go back" {...props} />
}
