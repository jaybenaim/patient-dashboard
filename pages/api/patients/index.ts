import { NextApiRequest, NextApiResponse } from 'next'
import { adminDb } from 'config/firebaseSDK'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // GET Patient
    try {
      const { id } = req.query

      if (typeof id === 'string') {
        const newPatient = await adminDb
          .collection('patients')
          .doc(id)
          .get()
          .then(doc => doc.exists && doc.data())

        return res.status(200).json({
          success: true,
          data: newPatient
        })
      } else {
        return res.status(400).json({ message: 'Missing id' })
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err
      })
    }
  } else if (req.method === 'POST') {
    // CREATE Patient
    try {
      const patientData = JSON.parse(req.body)

      const newPatient = await adminDb
        .collection('patients')
        .add(patientData)
        .then(async doc => {
          doc.set({ id: doc.id }, { merge: true })
          const d = await doc.get()
          return d.exists && d.data()
        })

      return res.status(200).json({
        success: true,
        data: newPatient
      })
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err
      })
    }
  } else if (req.method === 'PATCH') {
    try {
      const patientData = JSON.parse(req.body)

      const newPatient = await adminDb
        .collection('patients')
        .doc(patientData.id)
        .set(patientData, {
          merge: true
        })

      return res.status(200).json({
        success: true,
        data: newPatient
      })
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err
      })
    }
  }

  res.status(401).json({ message: 'Method not allowed' })
}
