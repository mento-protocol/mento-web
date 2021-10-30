import { NativeTokenId } from 'src/config/tokens'

export enum GrandaSubpage {
  List = 'list',
  View = 'view',
  Form = 'form',
  Confirm = 'confirm',
}

export interface GrandaFormValues {
  fromTokenId: NativeTokenId
  toTokenId: NativeTokenId
  fromAmount: number | string
}
