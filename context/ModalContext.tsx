import Modal from '@/components/Modal'
import { ReactNode, createContext, useContext, useState } from 'react'

interface IModalProps {
  show: boolean
  title?: string
  content?: ReactNode
  footer?: ReactNode
  width?: string
}

interface IModalContext {
  modalProps: IModalProps
  setModal: (modalProps: IModalProps) => void
}

const ModalContext = createContext<IModalContext | undefined>(undefined)

export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalProps, setModal] = useState<IModalProps>({
    show: false,
    title: '',
    content: '',
    width: 'w-[calc(100vw-4rem)] lg:max-w-2xl'
  })

  return (
    <ModalContext.Provider value={{ modalProps, setModal }}>
      {modalProps && modalProps.show && <Modal {...modalProps} />}
      {children}
    </ModalContext.Provider>
  )
}
