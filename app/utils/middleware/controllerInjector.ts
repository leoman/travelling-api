import "reflect-metadata";
import { Repository } from 'typeorm';
import {
  Post,
  Trip,
  Photo
} from '../../model';
import { Request } from '../../types';

// type Model = Post | Trip | Photo;

interface Props {
  controller: any;
  // controller: new (Repository: Repository<Object>) => Controller;
  model: string;
}

export enum Models {
  TRIP = 'Trip',
  POST = 'Post',
  PHOTO = 'Photo',
}

const setRepositoryAndController = <M>(request: Request, Controller: any, Model: Repository<M>): void => {
  const controller = new Controller(Model);
  request.context.controller = controller
}

export default (opts: Props) => {
  const { controller: Controller, model } = opts;
  return {
    before: async (request: Request): Promise<void> => {
      console.info(`Initiating repository`);
      switch (model) {
        case Models.TRIP: {
          setRepositoryAndController<Trip>(request, Controller, request.context.connection.getRepository(Trip))
          break;
        }
        case Models.POST: {
          setRepositoryAndController<Post>(request, Controller, request.context.connection.getRepository(Post))
          break;
        }
        case Models.PHOTO: {
          setRepositoryAndController<Photo>(request, Controller, request.context.connection.getRepository(Photo))
          break;
        }
        default: {
          throw new Error(`No entity matching: ${model} found`)
        }
      }
      console.info(`Done initiating repository`);
      console.info(`Done Initiating controller`);
    },
  };
};