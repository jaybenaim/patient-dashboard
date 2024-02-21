// context/UserContext.tsx
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'
import firebase from 'firebase/app'
import Auth from 'utils/helpers/auth'
import 'firebase/auth'
import * as api from 'utils/helpers/api'

interface UserContextProps {
  auth: Auth
  loading: boolean
  user: IUser | null
}

interface IUserProviderProps {
  children: ReactNode
}

export const UserContext = createContext<UserContextProps>({
  auth: api.auth,
  loading: true,
  user: {
    id: '',
    email: ''
  } as IUser
})

export const useAuth = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useAuth must be used within a UserProvider')
  }
  return context
}

export const UserProvider: React.FC<IUserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async authUser => {
      if (authUser?.uid) {
        // Race condition when creating a new account it's not ready when we need it
        setTimeout(async () => {
          const userInfo = await api.auth.get(authUser?.uid)

          if (userInfo?.success) {
            setUser(userInfo.data as IUser)
          }
        }, 1000)
      } else {
        setUser({} as IUser)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <UserContext.Provider value={{ auth: api.auth, user, loading }}>
      {children}
    </UserContext.Provider>
  )
}
