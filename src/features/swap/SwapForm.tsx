import { Field, Form, Formik, useFormikContext } from 'formik'
import { useState } from 'react'
import useDropdownMenu from 'react-accessible-dropdown-menu-hook'
import { IconButton } from 'src/components/buttons/IconButton'
import { SolidButton } from 'src/components/buttons/SolidButton'
import TokenSelectField from 'src/components/input/TokenSelectField'
import { CELO, cEUR, cUSD } from 'src/config/tokens'
import DownArrow from 'src/images/icons/arrow-down-short.svg'
import Sliders from 'src/images/icons/sliders.svg'

const initialValues = {
  fromToken: CELO.id,
  toToken: cUSD.id,
  fromAmount: '',
}

type FormValues = typeof initialValues

const tokens = [
  { value: cUSD.id, label: cUSD.symbol },
  { value: CELO.id, label: CELO.symbol },
  { value: cEUR.id, label: cEUR.symbol },
]

export function SwapForm() {
  const [toAmount, setToAmount] = useState('0.00')

  const onSubmit = (values: FormValues) => {
    alert(JSON.stringify(values, null, 2))
    setToAmount('1.00')
  }

  return (
    <div className="w-100 p-5 bg-white shadow-md rounded-lg">
      <div className="flex justify-between">
        <h2 className="text-lg font-medium">Swap</h2>
        <SettingsMenu />
      </div>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <div className="relative">
            <div className="flex justify-between items-center py-2 px-3 mt-6 bg-greengray-lightest rounded-md">
              <div className="flex items-center">
                <TokenSelectField
                  id="fromTokenSelect"
                  name="fromToken"
                  options={tokens}
                  label="From Token"
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
                  name="toToken"
                  options={tokens}
                  label="To Token"
                />
              </div>
              <div className="text-lg text-right">{toAmount}</div>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <SolidButton dark={true} size="m" type="submit">
              Connect Wallet
            </SolidButton>
          </div>
        </Form>
      </Formik>
    </div>
  )
}

function ReverseTokenButton() {
  const { values, setFieldValue } = useFormikContext<FormValues>()
  const { fromToken, toToken } = values

  const onClickReverse = () => {
    setFieldValue('fromToken', toToken)
    setFieldValue('toToken', fromToken)
  }

  return (
    <IconButton
      imgSrc={DownArrow}
      width={32}
      height={32}
      classes="p-3"
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
