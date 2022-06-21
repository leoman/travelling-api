import { Handler, APIGatewayEvent } from 'aws-lambda';
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler'
import dbInjector from '../utils/middleware/dbInjector'
import controllerInjector from '../utils/middleware/controllerInjector'
import auth from '../utils/middleware/auth'
import { MiddyContext as Context } from '../types';

import { PhotoEvent } from '../types';
import { PhotosController } from '../controller/photos';

interface MiddyContext extends Context {
  controller: PhotosController
}

export const createPhoto: Handler = async (event: PhotoEvent, { controller, connection }: MiddyContext) => {
  try {
    return await controller.createAction(event, connection);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deletePhoto: Handler = (event: APIGatewayEvent, { controller }: MiddyContext) => {
  try {
    return controller.deleteAction(event);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createPhotoHandler = middy(createPhoto)
  .use(auth())
  .use(dbInjector())
  .use(jsonBodyParser())
  .use(controllerInjector({ controller: PhotosController, model: 'Photo' }))
  .use(httpErrorHandler());

export const deletePhotoHandler = middy(deletePhoto)
  .use(auth())
  .use(dbInjector())
  .use(controllerInjector({ controller: PhotosController, model: 'Photo' }))
  .use(httpErrorHandler());
