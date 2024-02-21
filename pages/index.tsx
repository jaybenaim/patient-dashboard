import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Home = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/account/login')
  }, [])

  return <div></div>
}

export default Home
