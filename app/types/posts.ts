import { APIGatewayEvent } from 'aws-lambda';
import { PostDTO } from '../model';

type PostEvent = APIGatewayEvent & {
  body: PostDTO
}

export { PostEvent }