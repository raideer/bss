import clsx from 'clsx'
import { Button } from 'core/components/Button'
import { FC } from 'react'

interface Props {
  active: boolean;
  name: string;
  onApply: () => void;
  onEdit: () => void;
}

export const FilterPreset: FC<Props> = ({
  name,
  active,
  onApply,
  onEdit
}) => {
  return (
    <div className={clsx({
      'bss-fm-preset': true
    })}>
      <Button active={active} variant={active ? 'accent' : 'neutral'} onClick={() => onApply()} >{name}</Button>
      <Button active={active} variant={active ? 'accent' : 'neutral'} onClick={() => onEdit()}>
        <span className="icon-edit-pencil"></span>
      </Button>
    </div>
  )
}
