import { useAppDispatch } from 'src/app/hooks'
import { IconButton } from 'src/components/buttons/IconButton'
import { Table, TableColumn } from 'src/components/table/Table'
import { setShowSlippage } from 'src/features/swap/swapSlice'
import Sliders from 'src/images/icons/sliders.svg'
import { FloatingBox } from 'src/layout/FloatingBox'

export function ProposalList() {
  return (
    <FloatingBox width="w-128" classes="mb-12 mx-10">
      <div className="flex justify-between pb-4">
        <h2 className="text-lg font-medium pl-1">Granda Mento</h2>
        <NewButton />
      </div>
      <Table<any> columns={tableColumns} data={[]} initialSortBy="id" isLoading={false} />
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
    // TODO
    dispatch(setShowSlippage(true))
  }

  return (
    <div className="-mr-1 -mt-1">
      <IconButton
        imgSrc={Sliders}
        width={30}
        height={30}
        title="Create Proposal"
        onClick={onClickCreate}
      />
    </div>
  )
}
