import { FC, PropsWithChildren, useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import store from 'core/module/global-state/store'

export const Container: FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (ref.current) {
      const root = document.querySelector(':root') as any
      root.style.setProperty('--bss-adsRegion-paddingLeft', `${ref.current.offsetWidth + 10}px`)
    }
  }, [ref])

  return (
    <Provider store={store}>
      <span ref={ref} className="bss-button-container">{children}</span>
    </Provider>
  )
}
