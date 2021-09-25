import { useField } from 'formik'
import React, { PropsWithChildren } from 'react'
import Select, {
  components,
  OptionProps,
  OptionsType,
  SingleValueProps,
  Styles,
  Theme,
  ValueType,
} from 'react-select'
import { getTokenById, NativeTokens, Token } from 'src/config/tokens'
import { TokenIcon } from 'src/images/tokens/TokenIcon'
import { Color } from 'src/styles/Color'

export interface TokenOption {
  value: string
  label: string
}

// Make the name required
type Props = {
  id?: string
  name: string
  options: TokenOption[]
  label?: string
  onChange?: (option: TokenOption | null | undefined) => void
}

const DEFAULT_VALUE: TokenOption = {
  label: 'Select Token',
  value: '',
}

export default function TokenSelectField(props: Props) {
  const { id, name, label, options, onChange } = props
  const [field, , helpers] = useField<string>(name)

  const handleChange = (option: ValueType<TokenOption, false>) => {
    helpers.setValue(option?.value || '')
    if (onChange) onChange(option)
  }

  return (
    <Select<TokenOption>
      id={id}
      instanceId={id}
      options={options}
      name={field.name}
      value={options.find((option) => option.value === field.value) || DEFAULT_VALUE}
      onChange={handleChange}
      onBlur={field.onBlur}
      isLoading={false}
      isClearable={false}
      isSearchable={false}
      singleValueLabel={label}
      components={{ SingleValue, Option }}
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
      <TokenIcon size="l" token={token} />
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

function Option(props: OptionProps<TokenOption, false>) {
  // const  doo= props.
  const token = getTokenForValue(props.data)
  return (
    <components.Option {...props}>
      <div className="flex items-center">
        <TokenIcon size="s" token={token} />
        <div className="ml-3">{props.label}</div>
      </div>
    </components.Option>
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
      background: 'rgba(255,255,255,0.9)',
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
    padding: '7px 12px',
    color: `${Color.primaryBlack} !important`,
    cursor: 'pointer',
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
    primary75: Color.greengrayLight,
    primary50: Color.greengrayLighter,
    primary25: Color.greengrayLighter,
  },
})
