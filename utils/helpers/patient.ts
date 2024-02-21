class Patient {
  id?: string
  name?: IName
  dob?: string
  status?: string
  addresses?: IAddress[]
  error?: IErrorMessage

  constructor (patient?: IPatient) {
    this.id = patient?.id
    this.name = patient?.name
    this.dob = patient?.dob
    this.status = patient?.status
    this.addresses = patient?.addresses
  }

  set (patient: IPatient) {
    this.name = patient.name
    this.dob = patient.dob
    this.status = patient.status
    this.addresses = patient.addresses
  }

  async get (id: string) {
    try {
      let patient
      const patientResponse = await fetch(`/api/patients/${id}`, {
        method: 'GET'
      })

      if (patientResponse) {
        patient = await patientResponse.json()
        this.set(patient)
      }

      return patient
    } catch (err) {
      console.log('[ERROR] Patient.get', err)
      this.error = {
        success: false,
        message: 'Failed to get patient'
      }
      return this.error
    }
  }

  async create (patientData: IPatient) {
    try {
      let patient
      const patientResponse = await fetch('/api/patients/', {
        method: 'POST',
        body: JSON.stringify(patientData)
      })

      if (patientResponse) {
        patient = await patientResponse.json()
        this.set(patient)
      }

      return patient
    } catch (err) {
      console.log('ERROR Patient.create', err)
      this.error = {
        success: false,
        message: 'Failed to create patient'
      }
      return this.error
    }
  }

  async update (patientData: IPatient) {
    try {
      let patient
      const patientResponse = await fetch('/api/patients/', {
        method: 'PATCH',
        body: JSON.stringify(patientData)
      })

      if (patientResponse) {
        patient = await patientResponse.json()
      }

      return patient
    } catch (err) {
      console.log('ERROR Patient.create', err)
      this.error = {
        success: false,
        message: 'Failed to create patient'
      }
      return this.error
    }
  }

  async delete (patientId: string) {
    try {
      const response = await fetch(`/api/patients/${patientId}`, {
        method: 'DELETE'
      })

      return response
    } catch (err) {
      console.log('[ERROR] Patient.list', err)
      this.error = {
        success: false,
        message: 'Failed to list patients'
      }
      return this.error
    }
  }

  async list () {
    try {
      let patients
      const patientsResponse = await fetch(`/api/patients/list`, {
        method: 'GET'
      })

      if (patientsResponse) {
        const patientsData = await patientsResponse.json()
        patients = patientsData.data
      }

      return patients
    } catch (err) {
      console.log('[ERROR] Patient.list', err)
      this.error = {
        success: false,
        message: 'Failed to list patients'
      }
      return this.error
    }
  }
}

export default Patient
