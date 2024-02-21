type TNotificationVariants = 'default' | 'success' | 'error'

type TPatientFilterHandler<IPatient> = (patient: IPatient) => boolean

type TStatusFilterOption = 'inquiry' | 'onboarding' | 'active' | 'churned'

type TFieldTypes = 'text' | 'number'
