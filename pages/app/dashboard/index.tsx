import Dashboard from '@/Dashboard'
import Navbar from '@/Navbar'
import { PatientProvider } from 'context/PatientContext'
import { NextPage } from 'next'

interface Props {}

const DashboardPage: NextPage<Props> = ({}) => {
  return (
    <PatientProvider>
      <Navbar />

      <Dashboard />
    </PatientProvider>
  )
}

export default DashboardPage
