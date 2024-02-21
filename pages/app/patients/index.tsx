import Navbar from '@/Navbar'
import Patients from '@/Patients'
import { PatientProvider } from 'context/PatientContext'
import { NextPage } from 'next'

interface Props {}

const PatientPage: NextPage<Props> = ({}) => {
  return (
    <PatientProvider>
      <Navbar />

      <Patients />
    </PatientProvider>
  )
}

export default PatientPage
