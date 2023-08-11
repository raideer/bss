import { FC, PropsWithChildren, useRef } from 'react'
import { Button } from './Button'

interface Props {
  visible: boolean;
  title: string;
  onClose: () => void;
}

export const Modal: FC<PropsWithChildren<Props>> = ({ visible, title, onClose, children }) => {
  const ref = useRef<HTMLDivElement | null>(null)

  if (!visible) {
    return null
  }

  return (
    <div onClick={() => onClose()} className="bss-modal-backdrop">
      <div onClick={(e) => e.stopPropagation()} className='bss-modal'>
        <div ref={ref} className="bss-modal-body">
          <div className="bss-modal-header">
            <span>
              {title}
            </span>
            <span>
              <Button onClick={() => onClose()}>✕</Button>
            </span>
          </div>
          <div className="bss-modal-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
