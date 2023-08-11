import { StateProvider } from 'core/module/global-state/Provider'
import { FC } from 'react'
import { useSelector } from 'react-redux'

const Inner: FC = () => {
  const items = useSelector((state: any) => state.memo.items)

  return <span>
    {' '}({items.length})
  </span>
}

export const MemoCounter: FC = () => {
  return <StateProvider>
    <Inner />
  </StateProvider>
}
