import { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  try {
    const session = await getSession(req, res);

    if (session) {
      res.status(200).json({ user: session.user });
    } else {
      res.status(200).json({ user: null });
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    res.status(500).json({ error: 'Failed to get session' });
  }
});
