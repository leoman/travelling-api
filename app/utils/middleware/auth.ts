import jwt from 'jsonwebtoken';
import createError from 'http-errors';

export const authenticateToken = async (req: any) => {

  let auth = null;
  if (req && req.event.headers.authorization) {
    auth = req.event.headers.authorization
  } else if (req && req.event.headers.Authorization) {
    auth = req.event.headers.Authorization
  }

  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    try {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.USER_SECRET
      )
      return decodedToken
    } catch (error) {
      console.log(error)
      throw new createError(401, 'Failed to authenticate token.')
    }
  }
  throw new createError(401, 'Failed to recive auth token.')
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
        console.error(error);
        throw error
      } finally {
        console.info(`Done Authenticating User`);
      }
    },
  };
};



