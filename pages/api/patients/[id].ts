import { NextApiRequest, NextApiResponse } from 'next'
import { adminDb } from 'config/firebaseSDK'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query as any

      if (!id) {
        return res.status(400).json({ message: 'Missing id' })
      }

      await adminDb.collection('patients').doc(id).delete()

      return res.status(200).json({
        success: true
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
