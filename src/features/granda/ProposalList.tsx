import { useAppDispatch } from 'src/app/hooks'
import { IconButton } from 'src/components/buttons/IconButton'
import { Table, TableColumn } from 'src/components/table/Table'
import { setSubpage, viewProposal } from 'src/features/granda/grandaSlice'
import { GrandaSubpage } from 'src/features/granda/types'
import PlusCircle from 'src/images/icons/plus-circle-fill.svg'
import { FloatingBox } from 'src/layout/FloatingBox'

export function ProposalList() {
  const dispatch = useAppDispatch()
  const onRowClick = (id: string) => {
    dispatch(viewProposal(id))
  }

  return (
    <FloatingBox width="w-128" classes="mb-12 mx-10">
      <div className="flex justify-between pb-4">
        <h2 className="text-lg font-medium pl-1">Granda Mento</h2>
        <NewButton />
      </div>
      <Table<any>
        columns={tableColumns}
        data={[]}
        initialSortBy="id"
        isLoading={false}
        onRowClick={onRowClick}
      />
    </FloatingBox>
  )
}

const tableColumns: TableColumn[] = [
  {
    header: '#',
    id: 'id',
  },
  {
    header: 'Sell Amount',
    id: 'amount',
    renderer: (group) => `${group.amount.toFixed(2)}`,
  },
  {
    header: 'Token',
    id: 'stableToken',
  },
  {
    header: 'Rate',
    id: 'rate',
  },
  {
    header: 'Status',
    id: 'status',
    renderer: renderStatus,
  },
]

function renderStatus(group: any) {
  return group.status
}

function NewButton() {
  const dispatch = useAppDispatch()
  const onClickCreate = () => {
    dispatch(setSubpage(GrandaSubpage.Form))
  }

  return (
    <div className="-mr-1 -mt-1">
      <IconButton
        imgSrc={PlusCircle}
        width={30}
        height={30}
        title="Create Proposal"
        onClick={onClickCreate}
      />
    </div>
  )
}
