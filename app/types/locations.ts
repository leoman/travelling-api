import { APIGatewayEvent } from 'aws-lambda';
import { Location, LocationDTO } from '../model'; 

type LocationEvent = APIGatewayEvent & {
  body: LocationDTO
}

type LocationDTOType = (data: LocationDTO, entity?: Location) => Location

export { LocationEvent, LocationDTOType }