import Button from '@/components/Button'
import { useModal } from 'context/ModalContext'
import { ChangeEventHandler, useState } from 'react'
import PatientForm from './PatientForm'
import {
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { usePatients } from 'context/PatientContext'
import classNames from 'classnames'
import PatientFilters from './PatientFilters'

interface Props {}

const PatientTableHeader: React.FC<Props> = ({}) => {
  const { setModal } = useModal()
  const { filters, setSearchTerm, setFilters } = usePatients()

  const [showFilters, setShowFilters] = useState<boolean>(false)

  const handleNewPatientForm = () => {
    setModal({
      show: true,
      title: 'Add a patient',
      content: <PatientForm />
    })
  }

  const countArraysWithValue = (obj: any) => {
    let count = 0
    for (const key in obj) {
      if (Array.isArray(obj[key]) && obj[key].length > 0) {
        count++
      }
    }
    return count
  }

  const filterCounter = countArraysWithValue(filters)

  return (
    <div className='flex flex-col items-center justify-between py-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4'>
      {/* Search bar */}
      <div className='w-full'>
        <form className='flex items-center'>
          <label htmlFor='simple-search' className='sr-only'>
            Search
          </label>
          <div className='relative w-full'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <MagnifyingGlassIcon
                aria-hidden='true'
                className='w-5 h-5 text-gray-500 dark:text-gray-400'
              />
            </div>
            <input
              type='text'
              id='simple-search'
              className='block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
              placeholder='Search'
              onChange={({ target: { value } }) => setSearchTerm(value)}
            />
          </div>
        </form>
      </div>

      <div className='w-full'>
        <div className='flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3'>
          {/* Add Patient */}
          <Button
            type='button'
            variant='primary'
            className='!m-0 justify-center'
            onClick={handleNewPatientForm}
          >
            <PlusIcon className='h-5 w-5 mr-1' />
            Add patient
          </Button>

          {/* Filters */}
          <div className='flex items-center w-full md:w-1/4'>
            <Button
              id='filterDropdownButton'
              data-dropdown-toggle='filterDropdown'
              variant='secondary'
              fullWidth
              type='button'
              className='!m-0'
              onClick={() => setShowFilters(show => !show)}
            >
              <FunnelIcon className='w-5 h-5 mr-2 text-gray-400' />
              Filter
              <ChevronDownIcon className='-mr-1 ml-1.5 w-5 h-5' />
            </Button>

            {/* <!-- Background overlay --> */}
            {showFilters && (
              <div className='absolute inset-0 w-screen h-screen z-10 bg-black/10' />
            )}

            {/* <!-- Filter menu --> */}
            <PatientFilters
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              filterCounter={filterCounter}
            />
          </div>
        </div>

        {filterCounter > 0 && (
          <p className='flex justify-end text-sm pt-1'>
            {filterCounter} filter
            {filterCounter > 1 || filterCounter === 0 ? 's' : ''} active
          </p>
        )}
      </div>
    </div>
  )
}

export default PatientTableHeader
