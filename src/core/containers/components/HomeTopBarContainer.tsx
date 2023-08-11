import { FC, PropsWithChildren } from 'react'

export const HomeTopBarContainer: FC<PropsWithChildren> = ({ children }) => {
  return <div className="bss-container-htb">
    {children}
  </div>
}
