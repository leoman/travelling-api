import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import createError from 'http-errors';
import { MessageUtil } from '../utils/message';
import { LoginEvent } from '../types/auth';

export const authenticateUserCredentials = (username: string, password: string) => {

  const user = {
    username: process.env.USER_NAME,
    password: process.env.USER_PASSWORD
  };

  let passwordIsValid = false

  if (username === "" || password === "") {
    throw new createError(401, `User credentials were incorrect`)
  }

  try {
      passwordIsValid = bcrypt.compareSync(password, user.password)
  } catch (error) {
    console.error(error)
    throw new createError(400, `An error occurred while parsing the users password`)
  }

  if (username !== user.username || !passwordIsValid) {
    throw new createError(401, `User credentials were incorrect`)
  }

  return user.username
}

export class AuthController {

  async login (event: LoginEvent) {
    try {
      const { username, password } = event.body

      const response = authenticateUserCredentials(username, password)

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