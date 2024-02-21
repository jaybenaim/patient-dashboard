import { NextPage } from 'next'
import DashboardWrapper from '@/components/DashboardWrapper'
import { usePatients } from 'context/PatientContext'
import { useEffect, useMemo, useState } from 'react'
import PatientTableHeader from '@/Patients/components/PatientTableHeader'
import PatientTable from '@/Patients/PatientTable'

interface Props {}

interface IGroup {
  10: number
  20: number
  30: number
  40: number
  50: number
}

const Dashboard: NextPage<Props> = ({}) => {
  const { patients } = usePatients()

  const [ageGroups, setAgeGroups] = useState<{
    groups: IGroup
    percentages: IGroup
  }>()

  useEffect(() => {
    const calculatePatientGroups = () => {
      const groups = {
        10: 0,
        20: 0,
        30: 0,
        40: 0,
        50: 0
      }
      if (!patients) return groups

      // Count the patients in each age group
      for (const patient of patients) {
        const age = new Date().getFullYear() - Number(patient.dob.split('-')[0])

        if (age >= 50) {
          groups[50] += 1
        } else if (age >= 40) {
          groups[40] += 1
        } else if (age >= 30) {
          groups[30] += 1
        } else if (age >= 20) {
          groups[20] += 1
        } else {
          groups[10] += 1
        }
      }

      // Calculate percentage of the total to display graph bars
      const percentages = {
        10: 0,
        20: 0,
        30: 0,
        40: 0,
        50: 0
      }

      percentages[10] = Math.floor((groups[10] / patients.length) * 100)
      percentages[20] = Math.floor((groups[20] / patients.length) * 100)
      percentages[30] = Math.floor((groups[30] / patients.length) * 100)
      percentages[40] = Math.floor((groups[40] / patients.length) * 100)
      percentages[50] = Math.floor((groups[50] / patients.length) * 100)

      setAgeGroups({
        groups,
        percentages
      })
    }

    calculatePatientGroups()
  }, [patients])

  const activePatients = useMemo(
    () => patients?.filter(patient => patient.status === 'active'),
    [patients]
  )

  const newPatients = useMemo(
    () => patients?.filter(patient => patient.status === 'inquiry'),
    [patients]
  )

  return (
    <DashboardWrapper>
      <div className='grid w-full grid-cols-1 gap-4 mt-4 xl:grid-cols-2 2xl:grid-cols-3'>
        <div className='items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:border-gray-700 sm:p-6 dark:bg-gray-800'>
          <div className='w-full grid grid-cols-3'>
            <div>
              <h3 className='text-base font-normal text-gray-500 dark:text-gray-400'>
                <div className='inline-flex'>
                  New <span className='hidden sm:block ml-1'>Patients</span>
                </div>
              </h3>
              <span className='text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white'>
                {newPatients?.length}
              </span>
            </div>

            <div>
              <h3 className='text-base font-normal text-gray-500 dark:text-gray-400'>
                <div className='inline-flex'>
                  Active
                  <span className='hidden sm:block ml-1'>Patients</span>
                </div>
              </h3>
              <span className='text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white'>
                {activePatients?.length}
              </span>
            </div>

            <div>
              <h3 className='text-base font-normal text-gray-500 dark:text-gray-400'>
                <div className='inline-flex'>
                  Total <span className='hidden sm:block ml-1'>Patients</span>
                </div>
              </h3>
              <span className='text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white'>
                {patients?.length}
              </span>
            </div>
          </div>
        </div>

        <div className='p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800'>
          <div className='w-full'>
            <h3 className='mb-2 text-base font-normal text-gray-500 dark:text-gray-400'>
              Patients by age
            </h3>

            <div className='flex items-center mb-2'>
              <div className='w-16 text-sm font-medium dark:text-white'>
                50+
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
                <div
                  className='bg-primary-600 h-2.5 rounded-full dark:bg-primary-500'
                  style={{ width: `${ageGroups?.percentages?.[50]}%` }}
                ></div>
              </div>
            </div>
            <div className='flex items-center mb-2'>
              <div className='w-16 text-sm font-medium dark:text-white'>
                40+
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
                <div
                  className='bg-primary-600 h-2.5 rounded-full dark:bg-primary-500'
                  style={{ width: `${ageGroups?.percentages?.[40]}%` }}
                ></div>
              </div>
            </div>
            <div className='flex items-center mb-2'>
              <div className='w-16 text-sm font-medium dark:text-white'>
                30+
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
                <div
                  className='bg-primary-600 h-2.5 rounded-full dark:bg-primary-500'
                  style={{ width: `${ageGroups?.percentages?.[30]}%` }}
                ></div>
              </div>
            </div>
            <div className='flex items-center mb-2'>
              <div className='w-16 text-sm font-medium dark:text-white'>
                20+
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
                <div
                  className='bg-primary-600 h-2.5 rounded-full dark:bg-primary-500'
                  style={{ width: `${ageGroups?.percentages?.[20]}%` }}
                ></div>
              </div>
            </div>
            <div className='flex items-center mb-2'>
              <div className='w-16 text-sm font-medium dark:text-white'>
                {'<'}10
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
                <div
                  className='bg-primary-600 h-2.5 rounded-full dark:bg-primary-500'
                  style={{ width: `${ageGroups?.percentages?.[10]}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div id='traffic-channels-chart' className='w-full'></div>
        </div>
      </div>

      <h2 className='text-3xl font-extrabold dark:text-white mt-4'>Patients</h2>

      <PatientTableHeader />
      <PatientTable />
    </DashboardWrapper>
  )
}

export default Dashboard
