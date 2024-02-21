import { NextApiRequest, NextApiResponse } from 'next'
import { adminDb } from 'config/firebaseSDK'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    // CREATE User

    const { id, email, extraFields } = JSON.parse(req.body)

    if (typeof id === 'string') {
      await adminDb
        .collection('users')
        .doc(id)
        .set(
          {
            id,
            email,
            ...extraFields
          },
          { merge: true }
        )

      const newAccount = await adminDb
        .collection('users')
        .doc(id)
        .get()
        .then(q => q.exists && q.data())

      return res.status(200).json({
        success: true,
        data: newAccount
      })
    }

    res.status(400).json({ message: 'Missing id' })
  } else {
    res.status(401).json({ message: 'Method not allowed' })
  }
}
