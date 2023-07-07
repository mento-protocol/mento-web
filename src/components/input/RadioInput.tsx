import { Field } from 'formik'
import styles from 'src/components/input/RadioInput.module.css'

interface Props {
  name: string
  value: string
  label: string
}

export function RadioInput({ name, value, label }: Props) {
  return (
    <label className={styles.checkmarkContainer}>
      <div className="font-mono text-sm tracking-tight">{label}</div>
      <Field type="radio" name={name} value={value} />
      <span className={styles.checkmark}></span>
    </label>
  )
}
