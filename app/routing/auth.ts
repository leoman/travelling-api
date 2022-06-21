import { Handler } from 'aws-lambda';
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler'
import dbInjector from '../utils/middleware/dbInjector'

import { LoginEvent } from '../types';
import { AuthController } from '../controller/auth';

export const login: Handler = async (event: LoginEvent) => {
  const controller = new AuthController();
  try {
    return await controller.login(event);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const loginHandler = middy(login)
  .use(dbInjector())
  .use(jsonBodyParser())
  .use(httpErrorHandler());
