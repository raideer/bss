import { FC, PropsWithChildren, useEffect, useRef } from 'react'
import { StateProvider } from 'core/module/global-state/Provider'

export const ButtonContainer: FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (ref.current) {
      const root = document.querySelector(':root') as any
      root.style.setProperty('--bss-adsRegion-paddingLeft', `${ref.current.offsetWidth + 10}px`)
    }
  }, [ref])

  return (
    <StateProvider>
      <span ref={ref} className="bss-container-button">{children}</span>
    </StateProvider>
  )
}
