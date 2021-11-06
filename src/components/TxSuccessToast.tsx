import { toast } from 'react-toastify'
import { TextLink } from 'src/components/buttons/TextLink'
import { config } from 'src/config/config'

export function toastToYourSuccess(msg: string, txHash: string) {
  toast.success(<TxSuccessToast msg={msg} txHash={txHash} />, { autoClose: 15000 })
}

export function TxSuccessToast({ msg, txHash }: { msg: string; txHash: string }) {
  return (
    <div>
      {msg + ' '}
      <TextLink className="underline" href={`${config.blockscoutUrl}/tx/${txHash}`}>
        See Details
      </TextLink>
    </div>
  )
}
