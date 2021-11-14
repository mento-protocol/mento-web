import { toast } from 'react-toastify'
import { TextLink } from 'src/components/buttons/TextLink'

export function toastToYourSuccess(msg: string, txHash: string, blockscoutUrl: string) {
  toast.success(<TxSuccessToast msg={msg} txHash={txHash} blockscoutUrl={blockscoutUrl} />, {
    autoClose: 15000,
  })
}

export function TxSuccessToast({
  msg,
  txHash,
  blockscoutUrl,
}: {
  msg: string
  txHash: string
  blockscoutUrl: string
}) {
  return (
    <div>
      {msg + ' '}
      <TextLink className="underline" href={`${blockscoutUrl}/tx/${txHash}`}>
        See Details
      </TextLink>
    </div>
  )
}
