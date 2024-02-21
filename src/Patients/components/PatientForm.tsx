import FormField from '@/components/FormField'
import { useModal } from 'context/ModalContext'
import { useNotification } from 'context/NotificationContext'
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik'
import Patient from 'utils/helpers/patient'
import * as Yup from 'yup'
import useSWR from 'swr'
import Button from '@/components/Button'
import * as api from 'utils/helpers/api'
import ConfirmationModal from '@/components/ConfirmationModal'
import cx from 'classnames'
import {
  countryOptions,
  provinceOptions,
  stateOptions
} from './locationFieldOptions'

interface Props {
  patient?: IPatient
  editMode?: boolean
}

const PatientForm: React.FC<Props> = ({ patient, editMode }) => {
  const { mutate } = useSWR('/api/patients/list')

  const { setNotification } = useNotification()
  const { setModal } = useModal()

  const updatePatient = async (values: IPatient) => {
    try {
      await api.patient.update(values)

      mutate()
      setModal({
        show: false
      })
      setNotification({
        show: true,
        text: 'Successfully updated patient',
        variant: 'success'
      })
    } catch (err) {
      console.log('ERROR Failed to create patient', err)

      setNotification({
        show: true,
        text: 'Failed to add patient',
        variant: 'error'
      })
    }
  }

  const addNewPatient = async (values: IPatient) => {
    try {
      await api.patient.create(values)

      await mutate()
      setModal({
        show: false
      })
      setNotification({
        show: true,
        text: 'Successfully added patient',
        variant: 'success'
      })
    } catch (err) {
      console.log('ERROR Failed to create patient', err)

      setNotification({
        show: true,
        text: 'Failed to add patient',
        variant: 'error'
      })
    }
  }

  const handleDeletePatient = async (patientId: string | undefined) => {
    if (!patientId) {
      setNotification({
        show: true,
        text: 'Please try again later',
        variant: 'error'
      })
      return
    }

    try {
      const handleConfirmation = async () => {
        await api.patient.delete(patientId)
        setModal({
          show: false
        })
        mutate()
      }

      const handleCancelDelete = () => {
        setModal({
          show: true,
          title: 'Update patient',
          content: <PatientForm editMode patient={patient} />
        })
      }

      setModal({
        show: true,
        title: 'Confirmation',
        width: 'w-[calc(100vw-4rem)] lg:max-w-2xl',
        content: (
          <ConfirmationModal
            onConfirmation={handleConfirmation}
            onCancel={handleCancelDelete}
          />
        )
      })
    } catch (err) {
      console.log('ERROR Failed to delete patient', err)
      setNotification({
        show: true,
        text: 'Please try again later',
        variant: 'error'
      })
    }
  }

  const handleSubmit = (values: IPatient) => {
    if (editMode) {
      updatePatient(values)
    } else {
      addNewPatient(values)
    }
  }

  const addressSchema = Yup.object().shape({
    streetNumber: Yup.number().required('Required'),
    street: Yup.string().required('Required'),
    city: Yup.string().required('Required'),
    province: Yup.string().required('Required'),
    country: Yup.string().required('Required'),
    postalCode: Yup.string().max(6).required('Required')
  })

  const validationSchema = Yup.object().shape({
    name: Yup.object().shape({
      first: Yup.string().required('Required'),
      middle: Yup.string(),
      last: Yup.string().required('Required')
    }),
    dob: Yup.date().required('Required'),
    status: Yup.string().required('Required'),
    addresses: Yup.array()
      .of(addressSchema)
      .min(1, 'At least one address is required')
      .required('At least one address is required')
  })

  const statusOptions: ISelectOption[] = [
    { label: 'Inquiry', value: 'inquiry' },
    { label: 'Onboarding', value: 'onboarding' },
    { label: 'Active', value: 'active' },
    { label: 'Churned', value: 'churned' }
  ]

  const fieldTypeOptions: ISelectOption[] = [
    { label: 'Text', value: 'text' },
    { label: 'Number', value: 'number' }
  ]

  const defaultValues = {
    id: '',
    name: {
      first: '',
      middle: '',
      last: ''
    },
    dob: '',
    status: statusOptions[0].value,
    addresses: [],
    additionalFields: []
  } as IPatient

  return (
    <section className='bg-white dark:bg-gray-900 rounded-b-xl'>
      <Formik
        id='createPatient'
        initialValues={patient || defaultValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialized
      >
        {({ values, errors }) => (
          <Form id='createPatient'>
            <div className='py-6  overflow-auto max-h-[60vh]'>
              <h2 className='px-6 mb-4 text-xl font-bold text-gray-900 dark:text-white'>
                Patient Information
              </h2>

              <div className='px-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6'>
                <FormField name='name.first' label='First Name' />

                <FormField name='name.middle' label='Middle Name' />

                <FormField name='name.last' label='Last Name' />

                <FormField name='dob' label='Date of Birth' type='date' />
              </div>

              <h2
                className={cx(
                  'p-6 text-xl font-bold text-gray-900 dark:text-white',
                  values?.addresses && values?.addresses?.length > 0
                    ? 'mb-4'
                    : ''
                )}
              >
                Address
              </h2>

              {/* Dynamic address fields using FieldArray */}
              <FieldArray name='addresses'>
                {({ push, remove }: any) => (
                  <div className='px-6 space-y-4 divide-y'>
                    {values?.addresses?.map((field, index) => (
                      <div
                        key={index}
                        className={cx(
                          'relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6',
                          index > 0 ? 'pt-6' : ''
                        )}
                      >
                        <FormField
                          name={`addresses.${index}.streetNumber`}
                          label='Street Number'
                          type='number'
                        />

                        <FormField
                          name={`addresses.${index}.street`}
                          label='Street Name'
                        />

                        <FormField
                          name={`addresses.${index}.city`}
                          label='City'
                        />

                        <FormField
                          name={`addresses.${index}.province`}
                          label='Province'
                          type='select'
                          options={
                            field?.country === 'US'
                              ? stateOptions
                              : provinceOptions
                          }
                        />

                        <FormField
                          name={`addresses.${index}.country`}
                          label='Country'
                          type='select'
                          options={countryOptions}
                        />

                        <FormField
                          name={`addresses.${index}.postalCode`}
                          label='Postal Code'
                          className='uppercase'
                        />

                        <FormField
                          name={`addresses.${index}.primary`}
                          label='Primary'
                          type='checkbox'
                          className='!w-4'
                        />

                        <button
                          type='button'
                          onClick={() => remove(index)}
                          className={cx(
                            'text-red-500 text-sm ml-2 mt-4 absolute right-0',
                            index > 0 ? 'top-0' : '-top-8'
                          )}
                        >
                          Delete
                        </button>
                      </div>
                    ))}

                    <Button
                      type='button'
                      variant='secondary'
                      onClick={() => push('')}
                      fullWidth
                    >
                      Add address
                    </Button>
                  </div>
                )}
              </FieldArray>

              <h2 className='p-6 text-xl font-bold text-gray-900 dark:text-white'>
                Status
              </h2>

              <div className='px-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6'>
                <FormField
                  name='status'
                  label='Status'
                  type='select'
                  options={statusOptions}
                />
              </div>

              <h2 className='p-6 text-xl font-bold text-gray-900 dark:text-white'>
                Custom Fields
              </h2>

              {/* Dynamic fields using FieldArray */}
              <FieldArray name='additionalFields'>
                {({ push, remove }: any) => (
                  <div className='px-6 space-y-4 divide-y'>
                    {values?.additionalFields?.map((field, index) => (
                      <div
                        key={index}
                        className='pt-2 relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6'
                      >
                        <div className='col-span-2 lg:col-span-3 w-1/3 lg:w-1/4'>
                          <FormField
                            name={`additionalFields.${index}.fieldType`}
                            label='Field Type'
                            type='select'
                            options={fieldTypeOptions}
                          />
                        </div>

                        <FormField
                          name={`additionalFields.${index}.fieldLabel`}
                          label='Label:'
                        />

                        <FormField
                          name={`additionalFields.${index}.fieldValue`}
                          type={field?.fieldType}
                          label='Value:'
                        />

                        <button
                          type='button'
                          onClick={() => remove(index)}
                          className='text-red-500 text-sm ml-2 mt-4 absolute right-0 top-0'
                        >
                          Delete
                        </button>
                      </div>
                    ))}

                    <Button
                      type='button'
                      variant='secondary'
                      onClick={() => push('')}
                      className={cx(
                        values?.additionalFields &&
                          values?.additionalFields?.length > 0
                          ? 'mt-4'
                          : ''
                      )}
                      fullWidth
                    >
                      Add custom field
                    </Button>
                  </div>
                )}
              </FieldArray>
            </div>

            <div className='px-6 pb-6 flex w-full justify-between'>
              <div className='inline-flex items-center'>
                <div className='mr-2'>
                  <Button type='submit' className='!m-0'>
                    {editMode ? 'Update patient' : 'Add patient'}
                  </Button>
                </div>

                {/* Display error messages for missing address */}
                {typeof errors.addresses === 'string' && (
                  <ErrorMessage
                    component='div'
                    name='addresses'
                    className='text-sm text-red-500'
                  />
                )}
              </div>
              {editMode && (
                <Button
                  type='button'
                  variant='danger'
                  onClick={() => handleDeletePatient(patient?.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </section>
  )
}

export default PatientForm
