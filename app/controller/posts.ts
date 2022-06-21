import { DataSource, Repository } from 'typeorm';
import { APIGatewayEvent } from 'aws-lambda';

import {
  Post,
  dataToObject,
  PostDTO,
  Trip,
  Location,
  locationDataToObject,
} from '../model';
import { PostsService } from '../service/posts';
import { BaseController } from './base';
import { MessageUtil } from '../utils/message';
import { PostEvent } from '../types';


export class PostsController extends BaseController<Post, PostDTO> {
  constructor (repository: Repository<Post>) {
    super(repository);

    const postService = new PostsService(repository);

    this.setDataToObject(dataToObject);
    this.setService(postService);
  }

  async findAllAction (event: APIGatewayEvent) {
    try {
      const status: string|undefined = event.queryStringParameters?.status;
      const trip: string|undefined = event.queryStringParameters?.trip;

      const where = {
        ...(status && { status }),
        ...(trip && { trip: { slug: trip } }),
      }

      const options = { relations: ['location'] }
      const result = await this.service.find(where, options);
      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);
      return MessageUtil.error(err.code, err.message);
    }
  }

  async findOneAction (event: APIGatewayEvent) {
    const slug: string = event.pathParameters.slug;
    const options = { relations: ['photos', 'location', 'trip'] }
    try {
      const result = await this.service.findOneBySlug(slug, options);
      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);

      return MessageUtil.error(err.code, err.message);
    }
  }

  async createAction(event: PostEvent, connection?: DataSource) {
    const { trip: tripId, location } = event.body;
    const tripRepo = connection.getRepository(Trip);
    const locationRepo = connection.getRepository(Location);

    const trip = await tripRepo.findOne({ where: { id: Number(tripId) }})

    if (!trip) {
      throw new Error(`No trip was found using ID: ${tripId}`);
    }

    let currentLocation: Location | null;

    if (Number(location.id)) {
      currentLocation = await locationRepo.findOne({ where: { id: Number(location.id) }});
    }

    const locationEntity = locationDataToObject(location, currentLocation);

    const post = this.dataToObject(event.body, null, locationEntity, trip);

    try {
      const result = await this.service.create(post);
      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);
      return MessageUtil.error(err.code, err.message);
    }
  }

  async updateAction(event: PostEvent, connection?: DataSource) {
    const id: number = Number(event.pathParameters.id);
    const { location } = event.body;
    const locationRepo = connection.getRepository(Location);

    let currentLocation: Location | null;

    if (Number(location.id)) {
      currentLocation = await locationRepo.findOne({ where: { id: Number(location.id) }});
    }

    const locationEntity = locationDataToObject(location, currentLocation);

    const post = await this.service.findOneById(id);

    if (!post) {
      throw new Error(`No post was found using ID: ${id}`);
    }

    const entity = this.dataToObject(event.body, post, locationEntity);

    try {
      const result = await this.service.update(entity);
      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);
      return MessageUtil.error(err.code, err.message);
    }

  }

}
