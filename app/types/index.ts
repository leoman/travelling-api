import { Context } from 'aws-lambda';
import { DataSource } from 'typeorm';
import {
  PostsController,
  TripsController,
  PhotosController,
  AuthController,
} from '../controller';
import { PostEvent } from './posts'
import { TripEvent } from './trips'

type Controller = PostsController | TripsController | PhotosController | AuthController;

interface MiddyContext extends Context {
  connection?: DataSource;
  controller?: Controller;
}

interface Request {
  context: MiddyContext
}

export * from './posts';
export * from './trips';
export * from './locations';
export * from './photos';
export * from './auth';

type Event = PostEvent | TripEvent;

export {
  DataSource,
  Controller,
  MiddyContext,
  Request,
  Event,
};
