import { NextApiRequest, NextApiResponse } from 'next'
import { adminDb } from 'config/firebaseSDK'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { id } = req.query

    if (typeof id === 'string') {
      const user = await adminDb
        .collection('users')
        .doc(id)
        .get()
        .then(q => q.exists && q.data())

      return res.status(200).json({
        success: true,
        data: user
      })
    }
    res.status(401).json({ message: 'Missing id' })
  } else {
    // Handle GET request
    res.status(401).json({ message: 'Method not allowed' })
  }
}
