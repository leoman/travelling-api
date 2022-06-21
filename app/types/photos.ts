import { APIGatewayEvent } from 'aws-lambda';
import { Photo, PhotoDTO, Post } from '../model'; 

type PhotoEvent = APIGatewayEvent & {
  body: PhotoDTO
}

type PhotoDTOType = (data: PhotoDTO, currentPhoto?: Photo, post?: Post) => Photo

export { PhotoEvent, PhotoDTOType }