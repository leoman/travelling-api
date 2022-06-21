import jwt from 'jsonwebtoken';

export const authenticateToken = async (req: any) => {

  const auth = req ? req.event.headers.authorization : null

  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    try {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.USER_SECRET
      )
      console.log('authenticateToken', decodedToken)
      return decodedToken
    } catch (error) {
      throw new Error('Failed to authenticate token.')
    }
  }
  throw new Error('Failed to authenticate token.')
}

export default () => {
  return {
    before: async (request): Promise<void> => {
      console.info(`Authenticating User`);
      try {
        const decodedToken = await authenticateToken(request);
        request = {
          ...request,
          auth: {
            token: decodedToken
          }
        }
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        console.info(`Done Authenticating User`);
      }
    },
  };
};



