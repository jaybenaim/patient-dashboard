import Notification from '@/components/Notification'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

interface INotificationContext {
  notificationProps: INotification
  setNotification: (notification: INotification) => void
}

const NotificationContext = createContext<INotificationContext | undefined>(
  undefined
)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    )
  }
  return context
}

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notificationProps, setNotification] = useState<INotification>({
    show: false,
    text: '',
    href: '',
    ctaText: '',
    variant: 'default',
    delay: 5000
  })

  // Hide the notification after a delay
  useEffect(() => {
    const delay = notificationProps.delay || 5000

    const interval = setInterval(() => {
      setNotification({ show: false })
    }, delay)

    return () => clearInterval(interval)
  }, [])

  return (
    <NotificationContext.Provider
      value={{ notificationProps, setNotification }}
    >
      {notificationProps && notificationProps.show && (
        <Notification {...notificationProps} />
      )}
      {children}
    </NotificationContext.Provider>
  )
}
