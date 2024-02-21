import { NextPage } from 'next'
import PatientTable from '../Patients/PatientTable'
import PatientTableHeader from '@/Patients/components/PatientTableHeader'
import DashboardWrapper from '@/components/DashboardWrapper'

interface Props {}

const Patients: NextPage<Props> = ({}) => {
  return (
    <DashboardWrapper>
      <PatientTableHeader />
      <PatientTable />
    </DashboardWrapper>
  )
}

export default Patients
