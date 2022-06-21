import { APIGatewayEvent } from 'aws-lambda';

type LoginEvent = APIGatewayEvent & {
  body: {
    username: string
    password: string
  }
}

export { LoginEvent }