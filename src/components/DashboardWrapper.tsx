import { NextPage } from 'next'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const DashboardWrapper: React.FC<Props> = ({ children }) => {
  return (
    <section className='bg-gray-50 dark:bg-gray-900 flex items-center'>
      <div className='max-w-screen-xl px-4 mx-auto lg:px-12 w-full h-[calc(100vh-4rem)]'>
        {children}
      </div>
    </section>
  )
}

export default DashboardWrapper
