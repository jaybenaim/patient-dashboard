import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState
} from 'react'
import useSWR from 'swr'

import * as api from 'utils/helpers/api'

interface IPatientContext {
  setSearchTerm: Dispatch<SetStateAction<string | undefined>>
  filters: IPatientFilters
  setFilters: Dispatch<SetStateAction<IPatientFilters>>
  patients?: IPatient[]
  searchTerm?: string
}

const PatientContext = createContext<IPatientContext | undefined>(undefined)

export const usePatients = () => {
  const context = useContext(PatientContext)
  if (!context) {
    throw new Error('usePatients must be used within a PatientProvider')
  }
  return context
}

export const PatientProvider = ({ children }: { children: ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState<string | undefined>()
  const [filters, setFilters] = useState<IPatientFilters>({
    status: [],
    dob: [],
    cities: [],
    provinces: []
  })

  const { data: patients } = useSWR('/api/patients/list', api.patient.list, {
    fallback: [],
    revalidateOnMount: true
  })

  return (
    <PatientContext.Provider
      value={{
        patients,
        searchTerm,
        setSearchTerm,
        filters,
        setFilters
      }}
    >
      {children}
    </PatientContext.Provider>
  )
}
