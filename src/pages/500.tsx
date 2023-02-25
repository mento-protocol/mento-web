import { FailContent } from 'src/components/Errors'

export default function Custom500() {
  return <FailContent details="500 - Server-side error occurred" />
}
