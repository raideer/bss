interface Props {
  onClick: () => void
  text: string,
  className?: string
}

export const Button = ({ onClick, text, className }: Props) => {
  return <button className={`bss-core-button ${className || ''}`} type="button" onClick={onClick}>
    { text }
  </button>
}
