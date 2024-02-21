import { useAuth } from 'context/AuthContext'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

interface Props {}

const Logout: NextPage<Props> = () => {
  const { auth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    if (mounted) {
      auth.signOut()
      router.push('/account/login')
    }
    return () => {
      mounted = false
    }
  }, [])

  return null
}

export default Logout
