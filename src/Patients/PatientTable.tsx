import { useModal } from 'context/ModalContext'
import PatientForm from './components/PatientForm'
import { usePatients } from 'context/PatientContext'
import { useMemo } from 'react'

interface Props {}

const PatientTable: React.FC<Props> = ({}) => {
  const { patients, searchTerm, filters } = usePatients()
  const { setModal } = useModal()

  const handleOpenPatientInfo = (patientData: IPatient) => {
    setModal({
      show: true,
      title: 'Update patient',
      content: <PatientForm patient={patientData} editMode />
    })
  }

  // We separate the filters so we can filter by multiple filters at the same time
  const filteredPatients = useMemo(
    () =>
      patients &&
      patients
        // Status filter
        ?.filter((patient: IPatient) => {
          // Show all by default
          if (filters.status.length === 0) return true

          // Find matching status
          if (
            filters.status.length > 0 &&
            filters.status.includes(patient.status)
          ) {
            return true
          }
        })
        // Date filter
        ?.filter((patient: IPatient) => {
          // Show all by default
          if (filters.dob.length === 0) return true

          // Filter dates
          const fromDate = filters.dob[0] !== '' && filters.dob[0]
          const toDate = filters.dob[1] !== '' && filters.dob[1]

          // Filter between dates
          if (
            filters.dob.length > 0 &&
            toDate &&
            patient.dob >= fromDate &&
            patient.dob <= toDate
          ) {
            return true
          }

          // Filter greater than from
          if (filters.dob.length > 0 && !toDate && patient.dob >= fromDate) {
            return true
          }

          // Filter less than to
          if (filters.dob.length > 0 && !fromDate && patient.dob <= toDate) {
            return true
          }
        })
        // City filter
        ?.filter((patient: IPatient) => {
          // Show all by default
          if (filters.cities.length === 0) return true

          // Filter cities

          // Search patient cities
          if (
            patient.addresses?.some((address: IAddress) =>
              filters.cities.includes(address.city)
            )
          ) {
            return true
          }
        })
        // Province filter
        ?.filter((patient: IPatient) => {
          // Show all by default
          if (filters.provinces.length === 0) return true

          // Filter Provinces / State

          // Search patient provinces
          if (
            patient.addresses?.some((address: IAddress) =>
              filters.provinces.includes(address.province)
            )
          ) {
            return true
          }
        })
        // Search term filter
        ?.filter((patient: IPatient) => {
          if (!searchTerm) return true
          let formattedSearchTerm = searchTerm.toLowerCase()

          const fullName = `${patient.name.first} ${patient.name.middle} ${patient.name.last}`
          // Search  addresses
          if (patient.addresses && patient.addresses?.length > 0) {
            for (const address of patient.addresses) {
              const fullAddress = `${address.streetNumber} ${address.street} ${address.city} ${address.province} ${address.country} ${address.postalCode}`

              if (fullAddress.toLowerCase().includes(formattedSearchTerm)) {
                return true
              }
            }
          }

          // Search  custom fields
          if (
            patient.additionalFields &&
            patient.additionalFields?.length > 0
          ) {
            for (const field of patient.additionalFields) {
              const fullField = `${field.fieldLabel} ${field.fieldValue}`

              if (fullField.toLowerCase().includes(formattedSearchTerm)) {
                return true
              }
            }
          }

          if (
            fullName.toLowerCase().includes(formattedSearchTerm) ||
            patient.dob.includes(formattedSearchTerm) ||
            patient.status.includes(formattedSearchTerm)
          ) {
            return true
          }
        }),
    [patients, filters, searchTerm]
  )

  return (
    <div className='relative overflow-x-auto border-x border-t rounded-xl'>
      <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              Patient name
            </th>
            <th scope='col' className='px-6 py-3'>
              Status
            </th>
            <th scope='col' className='px-6 py-3 hidden md:table-cell'>
              Date of Birth
            </th>
            <th scope='col' className='px-6 py-3 hidden md:table-cell'>
              Address
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients &&
            filteredPatients?.length > 0 &&
            filteredPatients?.map((patientData: IPatient) => {
              let primaryAddress = patientData?.addresses?.find(
                address => address.primary
              )

              if (!primaryAddress) {
                primaryAddress = patientData?.addresses?.[0]
              }

              return (
                <tr
                  key={patientData.id}
                  className='bg-white rounded-xl border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 hover:cursor-pointer'
                  tabIndex={1}
                  onClick={() => handleOpenPatientInfo(patientData)}
                >
                  <th
                    scope='row'
                    className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                  >
                    {patientData?.name?.first} {patientData?.name?.last}
                  </th>
                  <td className='px-6 py-4 capitalize'>
                    {patientData?.status}
                  </td>
                  <td className='px-6 py-4 hidden md:table-cell'>
                    {patientData?.dob}
                  </td>
                  <td className='px-6 py-4 hidden md:table-cell'>
                    {primaryAddress?.streetNumber} {primaryAddress?.street}
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}

export default PatientTable
