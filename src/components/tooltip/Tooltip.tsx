export const Tooltip = ({ text, dataTestId = 'tooltipText' }: TooltipProps) => (
  <div className="absolute bottom-[-150%] transform -translate-x-[30%] bg-[rgb(29,29,32)] text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
    <span datatest-id={dataTestId}>{text}</span>
  </div>
)

interface TooltipProps {
  text: string
  dataTestId?: string
}
