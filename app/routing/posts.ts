import { Handler, APIGatewayEvent } from 'aws-lambda';
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler'
import dbInjector from '../utils/middleware/dbInjector'
import controllerInjector from '../utils/middleware/controllerInjector'
import auth from '../utils/middleware/auth'
import { MiddyContext as Context } from '../types';

import { PostEvent } from '../types';
import { PostsController } from '../controller/posts';

interface MiddyContext extends Context {
  controller: PostsController
}

export const createPost: Handler = async (event: PostEvent, { controller, connection }: MiddyContext) => {
  try {
    return await controller.createAction(event, connection);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updatePost: Handler = async (event: PostEvent, { controller, connection }: MiddyContext) => {
  try {
    return await controller.updateAction(event, connection);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findPosts: Handler = async (event: APIGatewayEvent, { controller }: MiddyContext) => {
  try {
    return await controller.findAllAction(event);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const findPost: Handler = (event: APIGatewayEvent, { controller }: MiddyContext) => {
  try {
    return controller.findOneAction(event);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deletePost: Handler = (event: APIGatewayEvent, { controller }: MiddyContext) => {
  try {
    return controller.deleteAction(event);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createPostHandler = middy(createPost)
  .use(auth())
  .use(dbInjector())
  .use(jsonBodyParser())
  .use(controllerInjector({ controller: PostsController, model: 'Post' }))
  .use(httpErrorHandler());


export const updatePostHandler = middy(updatePost)
  .use(auth())
  .use(dbInjector())
  .use(jsonBodyParser())
  .use(controllerInjector({ controller: PostsController, model: 'Post' }))
  .use(httpErrorHandler());

export const findPostsHandler = middy(findPosts)
  .use(dbInjector())
  .use(controllerInjector({ controller: PostsController, model: 'Post' }))
  .use(httpErrorHandler());


export const findPostHandler = middy(findPost)
  .use(dbInjector())
  .use(controllerInjector({ controller: PostsController, model: 'Post' }))
  .use(httpErrorHandler());


export const deletePostHandler = middy(deletePost)
  .use(auth())
  .use(dbInjector())
  .use(controllerInjector({ controller: PostsController, model: 'Post' }))
  .use(httpErrorHandler());
