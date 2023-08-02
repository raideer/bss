import store from 'core/module/global-state/store'
import { FC } from 'react'
import { Provider, useSelector } from 'react-redux'

const Inner: FC = () => {
  const items = useSelector((state: any) => state.memo.items)

  return <span>
    {' '}({items.length})
  </span>
}

export const MemoCounter: FC = () => {
  return <Provider store={store}>
    <Inner />
  </Provider>
}
