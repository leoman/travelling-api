import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import { MessageUtil } from '../utils/message';
import { LoginEvent } from '../types/auth';

export const authenticateUserCredentials = (username: string, password: string) => {

  const user = {
    username: process.env.USER_NAME,
    password: process.env.USER_PASSWORD
  };

  let passwordIsValid = false

  if (username === "" || password === "") {
    throw new Error(`User credentials were incorrect`)
  }

  try {
      passwordIsValid = bcrypt.compareSync(password, user.password)
  } catch (error) {
    console.error(error)
    throw new Error(`An error occurred while parsing the users password`)
  }

  if (username !== user.username || !passwordIsValid) {
    throw new Error(`User credentials were incorrect`)
  }

  return user.username
}

export class AuthController {

  async login (event: LoginEvent) {
    try {
      console.log('event', event)
      const { username, password } = event.body

      const response = authenticateUserCredentials(username, password)
      console.log('response', response);

      const token = jwt.sign({ username: response }, process.env.USER_SECRET, {
          expiresIn: 86400
      });

      return MessageUtil.success({ auth: true, token: token });
    } catch(err) {
      console.error(err);
      return MessageUtil.error(err.code, `Error logging in`);
    }
  }

}