import { APIGatewayEvent } from 'aws-lambda';
import { Trip, TripDTO } from '../model'; 

type TripEvent = APIGatewayEvent & {
  body: TripDTO
}

type TripDTOType = (body: TripEvent["body"], entity?: Trip) => Trip

export { TripEvent, TripDTOType }