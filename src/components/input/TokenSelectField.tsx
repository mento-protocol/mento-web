import { useField } from 'formik'
import React, { PropsWithChildren } from 'react'
import Select, { components, OptionsType, SingleValueProps, Styles, Theme } from 'react-select'
import { getTokenById, NativeTokens, Token } from 'src/config/tokens'
import { TokenIcon } from 'src/images/tokens/TokenIcon'
import { Color } from 'src/styles/Color'

interface TokenOption {
  value: string
  label: string
}

// Make the name required
type Props = {
  id?: string
  name: string
  options: TokenOption[]
  label?: string
}

const DEFAULT_VALUE: TokenOption = {
  label: 'Select Token',
  value: '',
}

export default function TokenSelectField(props: Props) {
  const { id, name, label, options } = props
  const [field, , helpers] = useField<string>(name)
  return (
    <Select<TokenOption>
      id={id}
      instanceId={id}
      options={options}
      name={field.name}
      value={options.find((option) => option.value === field.value) || DEFAULT_VALUE}
      onChange={(option) => helpers.setValue(option?.value || '')}
      onBlur={field.onBlur}
      isLoading={false}
      isClearable={false}
      isSearchable={false}
      singleValueLabel={label}
      components={{ SingleValue }}
      styles={customStyles}
      theme={customTheme}
    />
  )
}

function SingleValue({ children, ...props }: PropsWithChildren<SingleValueProps<TokenOption>>) {
  const { getValue, selectProps } = props
  const token = getTokenForValue(getValue())
  return (
    <div className="flex items-center p-1 tw-rounded-md">
      <TokenIcon token={token} />
      <div className="ml-3">
        <label htmlFor={selectProps.name} className="text-sm text-gray-400">
          {selectProps.singleValueLabel || 'Token'}
        </label>
        <div className="flex items-center">
          <components.SingleValue {...props}>{children}</components.SingleValue>
          <div className="ml-1">
            <components.DownChevron />
          </div>
        </div>
      </div>
    </div>
  )
}

function getTokenForValue(value: OptionsType<TokenOption>): Token | null {
  let id: string | null = null
  if (Array.isArray(value)) {
    id = value[0].value
  } else {
    // @ts-ignore
    id = value.value
  }
  if (!id) return null
  return getTokenById(id, { ...NativeTokens })
}

const customStyles: Styles<any, false> = {
  control: (provided) => ({
    ...provided,
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    boxShadow: 'none',
    background: 'transparent',
    ':hover': {
      background: 'rgba(255,255,255,0.6)',
    },
  }),
  indicatorsContainer: () => ({
    display: 'none',
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: 0,
  }),
  option: (provided) => ({
    ...provided,
    // borderBottom: `1px solid ${Color.borderLight}`,
    padding: '10px 20px',
    color: `${Color.primaryBlack} !important`,
  }),
  singleValue: () => ({
    margin: 0,
    fontSize: '18px',
    fontWeight: 500,
    color: Color.primaryBlack,
  }),
}

const customTheme = (theme: Theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: Color.greengrayLight,
    primary75: Color.greengrayLighter,
    primary50: Color.greengrayLighter,
    primary25: Color.greengrayLighter,
  },
})
