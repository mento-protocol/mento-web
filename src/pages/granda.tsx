import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { setSubpage } from 'src/features/granda/grandaSlice'
import { ProposalConfirm } from 'src/features/granda/ProposalConfirm'
import { ProposalForm } from 'src/features/granda/ProposalForm'
import { ProposalList } from 'src/features/granda/ProposalList'
import { ProposalView } from 'src/features/granda/ProposalView'
import { GrandaSubpage } from 'src/features/granda/types'

export default function GrandaPage() {
  const subpage = useAppSelector((s) => s.granda.subpage)
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Restore subpage to list if users leaves granda
    return () => {
      dispatch(setSubpage(GrandaSubpage.List))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex justify-center items-center flex-grow">
      {subpage === GrandaSubpage.List && <ProposalList />}
      {subpage === GrandaSubpage.View && <ProposalView />}
      {subpage === GrandaSubpage.Form && <ProposalForm />}
      {subpage === GrandaSubpage.Confirm && <ProposalConfirm />}
    </div>
  )
}
