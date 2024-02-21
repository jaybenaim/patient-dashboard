import { ErrorMessage, Field } from 'formik'
import { HTMLInputTypeAttribute } from 'react'
import { inputClass } from 'utils/classes'

interface Props {
  name: string
  label: string
  className?: string
  options?: ISelectOption[]
  type?: HTMLInputTypeAttribute
}

const FormField: React.FC<Props> = ({
  name,
  label,
  className,
  options,
  type = 'text',
  ...rest
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
      >
        {label}
      </label>

      <div className='mt-2'>
        {type !== 'select' && (
          <Field
            id={name}
            name={name}
            type={type}
            autoComplete={name}
            className={`${className} ${inputClass}`}
            {...rest}
          />
        )}

        {/* Select Field */}

        {type === 'select' && (
          <Field
            id={name}
            name={name}
            as='select'
            className={`${className} ${inputClass}`}
            {...rest}
          >
            {options?.map((option: { label: string; value: string }) => (
              <option key={option?.label} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </Field>
        )}

        <ErrorMessage
          name={name}
          component='small'
          className='error text-xs text-red-500'
        />
      </div>
    </div>
  )
}

export default FormField
