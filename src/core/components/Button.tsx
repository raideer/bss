import clsx from 'clsx'
import { FC, PropsWithChildren } from 'react'

interface Props {
  onClick?: (e: any) => void
  className?: string
  active?: boolean
  type?: 'button' | 'submit'
  variant?: 'default' | 'neutral' | 'accent' | 'warning'
  size?: 'sm' | 'md' | 'lg'
}

export const Button: FC<PropsWithChildren<Props>> = ({ onClick, children, className, active, type = 'button', size = 'sm', variant = 'default' }) => {
  return (
    <button
      className={clsx('bss-button', className, {
        [`bss-button-${variant}`]: variant !== 'default',
        [`bss-button-${size}`]: size !== 'sm',
        'bss-button-active': active
      })}
      type={type}
      onClick={onClick}
    >
      { children }
    </button>
  )
}
