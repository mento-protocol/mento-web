import { useContractKit } from '@celo-tools/use-contractkit'
import { Field, Form, Formik, useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import useDropdownMenu from 'react-accessible-dropdown-menu-hook'
import { useAppDispatch } from 'src/app/hooks'
import { IconButton } from 'src/components/buttons/IconButton'
import { SolidButton } from 'src/components/buttons/SolidButton'
import TokenSelectField, { TokenOption } from 'src/components/input/TokenSelectField'
import { CELO, cEUR, cUSD, isStableToken, NativeTokenId } from 'src/config/tokens'
import { setFormValues } from 'src/features/swap/swapSlice'
import { SwapFormValues } from 'src/features/swap/types'
import DownArrow from 'src/images/icons/arrow-down-short.svg'
import Sliders from 'src/images/icons/sliders.svg'
import { FloatingBox } from 'src/layout/FloatingBox'

const initialValues: SwapFormValues = {
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
  const { connect, address } = useContractKit()

  const dispatch = useAppDispatch()
  const onSubmit = (values: SwapFormValues) => {
    console.log(JSON.stringify(values, null, 2))
    dispatch(setFormValues(values))
  }

  return (
    <FloatingBox width="w-96" classes="overflow-visible">
      <div className="flex justify-between">
        <h2 className="text-lg font-medium pl-1">Swap</h2>
        <SettingsMenu />
      </div>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <SwapFormInputs />
          <div className="flex justify-center mt-6 mb-1">
            {address ? (
              <SolidButton dark={true} size="m" type="submit">
                Review Swap
              </SolidButton>
            ) : (
              <SolidButton dark={true} size="m" onClick={connect}>
                Connect Wallet
              </SolidButton>
            )}
          </div>
        </Form>
      </Formik>
    </FloatingBox>
  )
}

function SwapFormInputs() {
  const { values, setFieldValue } = useFormikContext<SwapFormValues>()

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
      <div className="flex justify-between items-center py-2 px-3 mt-5 bg-greengray-lightest rounded-md">
        <div className="flex items-center">
          <TokenSelectField
            id="fromTokenSelect"
            name="fromTokenId"
            options={tokens}
            label="From Token"
            onChange={onChangeToken(true)}
          />
          <FieldDividerLine />
        </div>
        <Field
          id="fromAmount"
          name="fromAmount"
          type="number"
          placeholder="0.00"
          className="w-36 bg-transparent text-right text-xl font-mono focus:outline-none"
        />
      </div>
      <div className="bg-white rounded-full absolute left-4 top-2/4 -translate-y-1/2 hover:rotate-180 transition-all">
        <ReverseTokenButton />
      </div>
      <div className="flex items-center justify-end my-2.5 px-1.5 text-xs text-gray-400">
        5.1 cUSD ~ 1 CELO
      </div>
      <div className="flex justify-between items-center py-2 px-3 bg-greengray-lightest rounded-md">
        <div className="flex items-center">
          <TokenSelectField
            id="toTokenSelect"
            name="toTokenId"
            options={tokens}
            label="To Token"
            onChange={onChangeToken(false)}
          />
          <FieldDividerLine />
        </div>
        <OutputEstimateField />
      </div>
    </div>
  )
}

function OutputEstimateField() {
  const [toAmount, setToAmount] = useState('0.00')

  const { values, touched, setFieldValue } = useFormikContext<SwapFormValues>()

  useEffect(() => {
    setToAmount(values.fromAmount?.toString() || '0.00')
  }, [values, touched, setFieldValue])

  return <div className="text-xl text-right font-mono w-36 overflow-hidden">{toAmount}</div>
}

function ReverseTokenButton() {
  const { values, setFieldValue } = useFormikContext<SwapFormValues>()
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
      classes="p-1.5"
      title="Swap inputs"
      onClick={onClickReverse}
    />
  )
}

function FieldDividerLine() {
  return <div className="w-px h-12 ml-3 bg-gray-300"></div>
}

function SettingsMenu() {
  const { buttonProps, itemProps, isOpen } = useDropdownMenu(3)

  return (
    <div className="relative mt-1 mr-1">
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
