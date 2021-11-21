import { IconButton, IconButtonProps } from 'src/components/buttons/IconButton'
import RepeatArrow from 'src/images/icons/arrow-repeat.svg'

export function RefreshButton(props: IconButtonProps) {
  return <IconButton imgSrc={RepeatArrow} title="Refresh" {...props} />
}
