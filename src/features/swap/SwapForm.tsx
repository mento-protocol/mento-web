import { Field, Form, Formik, useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import useDropdownMenu from 'react-accessible-dropdown-menu-hook'
import { IconButton } from 'src/components/buttons/IconButton'
import { SolidButton } from 'src/components/buttons/SolidButton'
import TokenSelectField, { TokenOption } from 'src/components/input/TokenSelectField'
import { CELO, cEUR, cUSD, isStableToken, NativeTokenId } from 'src/config/tokens'
import DownArrow from 'src/images/icons/arrow-down-short.svg'
import Sliders from 'src/images/icons/sliders.svg'
import { FloatingBox } from 'src/layout/FloatingBox'

interface FormValues {
  fromTokenId: NativeTokenId
  toTokenId: NativeTokenId
  fromAmount: number | string
}

const initialValues: FormValues = {
  fromTokenId: NativeTokenId.CELO,
  toTokenId: NativeTokenId.cUSD,
  fromAmount: '',
}

const tokens = [
  { value: NativeTokenId.CELO, label: CELO.symbol },
  { value: NativeTokenId.cUSD, label: cUSD.symbol },
  { value: NativeTokenId.cEUR, label: cEUR.symbol },
]

export function SwapForm() {
  const onSubmit = (values: FormValues) => {
    alert(JSON.stringify(values, null, 2))
  }

  return (
    <FloatingBox width="w-100">
      <div className="flex justify-between">
        <h2 className="text-lg font-medium">Swap</h2>
        <SettingsMenu />
      </div>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <SwapFormInputs />
          <div className="flex justify-center mt-8">
            <SolidButton dark={true} size="m" type="submit">
              Connect Wallet
            </SolidButton>
          </div>
        </Form>
      </Formik>
    </FloatingBox>
  )
}

function SwapFormInputs() {
  const { values, setFieldValue } = useFormikContext<FormValues>()

  const onChangeToken = (isFromToken: boolean) => (option: TokenOption | null | undefined) => {
    const tokenId = option?.value || NativeTokenId.CELO
    const targetField = isFromToken ? 'fromTokenId' : 'toTokenId'
    const otherField = isFromToken ? 'toTokenId' : 'fromTokenId'
    if (isStableToken(tokenId)) {
      setFieldValue(targetField, tokenId)
      setFieldValue(otherField, NativeTokenId.CELO)
    } else {
      const stableTokenId = isStableToken(values[targetField])
        ? values[targetField]
        : NativeTokenId.cUSD
      setFieldValue(targetField, tokenId)
      setFieldValue(otherField, stableTokenId)
    }
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center py-2 px-3 mt-6 bg-greengray-lightest rounded-md">
        <div className="flex items-center">
          <TokenSelectField
            id="fromTokenSelect"
            name="fromTokenId"
            options={tokens}
            label="From Token"
            onChange={onChangeToken(true)}
          />
        </div>
        <Field
          id="fromAmount"
          name="fromAmount"
          type="number"
          placeholder="0.00"
          className="w-24 bg-transparent text-right text-lg focus:outline-none"
        />
      </div>
      <div className="bg-white rounded-full absolute left-3.5 top-2/4 -translate-y-1/2 hover:rotate-180 transition-all">
        <ReverseTokenButton />
      </div>
      <div className="flex justify-between items-center py-2 px-3 mt-8 bg-greengray-lightest rounded-md">
        <div className="flex items-center">
          <TokenSelectField
            id="toTokenSelect"
            name="toTokenId"
            options={tokens}
            label="To Token"
            onChange={onChangeToken(false)}
          />
        </div>
        <OutputEstimateField />
      </div>
    </div>
  )
}

function OutputEstimateField() {
  const [toAmount, setToAmount] = useState('0.00')

  const { values, touched, setFieldValue } = useFormikContext<FormValues>()

  useEffect(() => {
    setToAmount(values.fromAmount?.toString() || '0.00')
  }, [values, touched, setFieldValue])

  return <div className="text-lg text-right">{toAmount}</div>
}

function ReverseTokenButton() {
  const { values, setFieldValue } = useFormikContext<FormValues>()
  const { fromTokenId, toTokenId } = values

  const onClickReverse = () => {
    setFieldValue('fromTokenId', toTokenId)
    setFieldValue('toTokenId', fromTokenId)
  }

  return (
    <IconButton
      imgSrc={DownArrow}
      width={32}
      height={32}
      classes="p-2"
      title="Swap inputs"
      onClick={onClickReverse}
    />
  )
}

function SettingsMenu() {
  const { buttonProps, itemProps, isOpen } = useDropdownMenu(3)

  return (
    <div className="relative">
      <IconButton
        imgSrc={Sliders}
        width={20}
        height={20}
        title="Settings"
        passThruProps={buttonProps}
      />
      <div className={`dropdown-menu -right-1 bg-white ${isOpen ? '' : 'hidden'}`} role="menu">
        <a {...itemProps[0]} href="https://example.com">
          Regular link
        </a>
        <a {...itemProps[1]} onClick={() => alert('alert')}>
          With click handler
        </a>
      </div>
    </div>
  )
}
