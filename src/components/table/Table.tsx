import { ReactElement, useMemo, useState } from 'react'
import { Spinner } from 'src/components/animation/Spinner'
import { ChevronIcon } from 'src/components/Chevron'

export interface TableColumn {
  id: string // its key in the data
  header: string
  renderer?: (dataCell: any) => string | ReactElement
}

type DataElement = { id: string } & Record<string, any>

interface Props<T extends DataElement> {
  columns: TableColumn[]
  data: T[]
  onRowClick?: (id: string) => void
  initialSortBy?: string // column id
  isLoading?: boolean
}

export function Table<T extends DataElement>(props: Props<T>) {
  const { columns, data, onRowClick, initialSortBy, isLoading } = props

  const [sortBy, setSortBy] = useState(initialSortBy ?? columns[0].id)
  const [sortDesc, setSortDesc] = useState(true)

  const sortedData = useMemo(() => {
    return sortDataBy<T>(data, sortBy, sortDesc)
  }, [data, sortBy, sortDesc])

  const onColumnClick = (columnId: string) => {
    if (columnId === sortBy) {
      setSortDesc(!sortDesc)
    } else {
      setSortBy(columnId)
      setSortDesc(true)
    }
  }

  return (
    <div style={{ minHeight: '20rem' }} className="relative">
      <table className={`w-full border-collapse ${isLoading && 'opacity-70 blur-sm'}`}>
        <thead>
          <tr>
            {columns.map((column) => {
              const isSelected = column.id === sortBy
              return (
                <th
                  key={`table-column-${column.id}`}
                  onClick={() => onColumnClick(column.id)}
                  className={`font-medium text-center px-4 pb-3 border-b border-gray-400 cursor-pointer ${
                    isSelected && 'pr-0'
                  }`}
                >
                  <>
                    {column.header}
                    {isSelected && (
                      <ChevronIcon
                        width="12px"
                        height="7px"
                        direction={sortDesc ? 's' : 'n'}
                        classes="opacity-90 ml-2"
                      />
                    )}
                  </>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={columns.length} className="h-2"></td>
          </tr>
          {sortedData.map((row, i) => {
            return (
              <tr
                onClick={onRowClick ? () => onRowClick(row.id) : undefined}
                key={`table-row-${i}`}
              >
                {columns.map((column, j) => {
                  return (
                    <td
                      key={`table-cell-${i}-${j}`}
                      className="pb-4 cursor-pointer hover:bg-gray-200 active:bg-gray-300"
                    >
                      <div className="relative">
                        {column.renderer ? column.renderer(row) : row[column.id]}
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      {isLoading && (
        <div className="flex items-center justify-center absolute inset-0 opacity-70 z-30">
          <Spinner />
        </div>
      )}
    </div>
  )
}

function sortDataBy<T extends DataElement>(data: T[], columnId: string, descending: boolean) {
  return [...data].sort((a, b) => {
    let aVal = a[columnId]
    let bVal = b[columnId]
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }
    const order = descending ? aVal > bVal : aVal <= bVal
    return order ? -1 : 1
  })
}
