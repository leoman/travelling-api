import { Handler, APIGatewayEvent } from 'aws-lambda';
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler'
import dbInjector from '../utils/middleware/dbInjector'
import controllerInjector from '../utils/middleware/controllerInjector'
import auth from '../utils/middleware/auth'
import { MiddyContext as Context } from '../types';

import { TripEvent } from '../types';
import { TripsController } from '../controller/trips';

interface MiddyContext extends Context {
  controller: TripsController
}

export const createTrip: Handler = async (event: TripEvent, { controller }: MiddyContext) => {
  try {
    return await controller.createAction(event);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateTrip: Handler = async (event: TripEvent, { controller }: MiddyContext) => {
  try {
    return await controller.updateAction(event);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findTrips: Handler = async (event: APIGatewayEvent, { controller }: MiddyContext) => {
  try {
    return await controller.findAllAction(event);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const findTrip: Handler = (event: APIGatewayEvent, { controller }: MiddyContext) => {
  try {
    return controller.findOneAction(event);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteTrip: Handler = (event: APIGatewayEvent, { controller }: MiddyContext) => {
  try {
    return controller.deleteAction(event);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createTripHandler = middy(createTrip)
  .use(auth())
  .use(dbInjector())
  .use(jsonBodyParser())
  .use(controllerInjector({ controller: TripsController, model: 'Trip' }))
  .use(httpErrorHandler());


export const updateTripHandler = middy(updateTrip)
  .use(auth())
  .use(dbInjector())
  .use(jsonBodyParser())
  .use(controllerInjector({ controller: TripsController, model: 'Trip' }))
  .use(httpErrorHandler());

export const findTripsHandler = middy(findTrips)
  .use(dbInjector())
  .use(controllerInjector({ controller: TripsController, model: 'Trip' }))
  .use(httpErrorHandler());


export const findTripHandler = middy(findTrip)
  .use(dbInjector())
  .use(controllerInjector({ controller: TripsController, model: 'Trip' }))
  .use(httpErrorHandler());


export const deleteTripHandler = middy(deleteTrip)
  .use(auth())
  .use(dbInjector())
  .use(controllerInjector({ controller: TripsController, model: 'Trip' }))
  .use(httpErrorHandler());
