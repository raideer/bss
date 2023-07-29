import clsx from "clsx"
import { FC } from "react"

interface Props {
  onClick: (e: any) => void
  className?: string
  active?: boolean
  variant?: 'default' | 'neutral' | 'accent'
}

export const Button: FC<Props> = ({ onClick, children, className, active, variant = 'default' }) => {
  return (
    <button
      className={clsx('bss-button', className, {
        [`bss-button-${variant}`]: variant !== 'default',
        'bss-button-active': active
      })}
      type="button"
      onClick={onClick}
    >
      { children }
    </button>
  )
}
