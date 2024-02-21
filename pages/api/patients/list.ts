import { NextApiRequest, NextApiResponse } from 'next'
import { adminDb } from 'config/firebaseSDK'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // GET Patient
    try {
      const patientList = await adminDb
        .collection('patients')
        .get()
        .then(queryset =>
          !queryset.empty ? queryset.docs.map(doc => doc.data()) : null
        )

      return res.status(200).json({
        success: true,
        data: patientList
      })
    } catch (err) {
      console.log('[ERROR] Failed to get patient list', err)
      return res.status(500).json({
        success: false,
        error: err
      })
    }
  }

  res.status(401).json({ message: 'Method not allowed' })
}
