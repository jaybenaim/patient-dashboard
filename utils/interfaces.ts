interface IUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  fullName?: string
}
interface IErrorMessage {
  success: boolean
  message: string
  code?: string
  data?: any
}

interface NotificationProps {
  text?: string
  href?: string
  ctaText?: string
  variant?: TNotificationVariants
}

interface INotification {
  show: boolean
  text?: string
  href?: string
  ctaText?: string
  variant?: TNotificationVariants
  delay?: number
}

interface ISelectOption {
  label: string
  value: string
}

interface IName {
  first: string
  middle: string
  last: string
}

interface IAddress {
  primary: boolean
  street: string
  streetNumber: string
  city: string
  province: string
  country: string
  postalCode: string
}

interface IPatient {
  id: string
  name: IName
  dob: string
  status: TStatusFilterOption
  addresses?: IAddress[]
  additionalFields?: {
    fieldType: TFieldTypes
    fieldValue: string
    fieldLabel: string
  }[]
}

interface IPatientFilters {
  status: TStatusFilterOption[]
  dob: string[]
  cities: string[]
  provinces: string[]
}
