import { useEffect, useRef } from "preact/hooks"

export const Container = ({ children }: { children: any }) => {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const root = document.querySelector(':root') as any
      root.style.setProperty('--bss-adsRegion-paddingLeft', `${ref.current.offsetWidth + 10}px`)
    }
  }, [ref])

  return (
    <span ref={ref} class="bss-button-container">{children}</span>
  )
}
