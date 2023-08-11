import { Button } from 'core/components/Button'
import { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToMemo, removeFromMemo } from '../state/memo.slice'
import { GlobalState } from 'core/module/global-state/store'
import { SETTING_ENABLED } from '..'

interface Props {
  id: string;
}

export const MemoButton: FC<Props> = ({ id }) => {
  const enabled = useSelector((state: GlobalState) => state.settings.values[SETTING_ENABLED])
  const dispatch = useDispatch<any>()
  const items = useSelector((state: any) => state.memo.items)
  const added = items.indexOf(id) > -1

  const onClick = async (e: any) => {
    e.stopPropagation()

    if (!id) {
      return
    }

    const remove = items.indexOf(id) !== -1

    if (remove) {
      dispatch(removeFromMemo(id))
    } else {
      dispatch(addToMemo(id))
    }
  }

  if (!enabled) {
    return null
  }

  return (
    <Button onClick={onClick} variant={added ? 'accent' : 'default'}>
      <span>{ added ? '-' : '+'} Memo</span>
    </Button>
  )
}
