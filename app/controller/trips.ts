import { Repository } from 'typeorm';
import { APIGatewayEvent } from 'aws-lambda';

import { Trip, tripDataToObject, TripDTO } from '../model';
import { TripService } from '../service/trips';
import { MessageUtil } from '../utils/message';
import { BaseController } from './base';


export class TripsController extends BaseController<Trip, TripDTO> {
  constructor (repository: Repository<Trip>) {
    super(repository);

    const tripService = new TripService(repository);

    this.setDataToObject(tripDataToObject);
    this.setService(tripService);
  }

  async findOneAction (event: APIGatewayEvent) {
    const id: number = Number(event.pathParameters.id);
    const options = { relations: ['posts', 'posts.location'] }
    try {
      const result = await this.service.findOneById(id, options);
      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);

      return MessageUtil.error(err.code, err.message);
    }
  }

}
