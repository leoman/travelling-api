import { Repository } from 'typeorm';
import { APIGatewayEvent } from 'aws-lambda';

import { MessageUtil } from '../utils/message';
import { Service } from '../service/base';


export class BaseController<T, E> {
  protected dataToObject: (body: E, entity?: T, entityb?: any, join?: any) => T

  protected service: Service<T>
  protected repository: Repository<T>

  constructor (repository: Repository<T>) {
    this.setRepository(repository)
  }6

  setService(service: Service<T>) {
    this.service = service;
  }

  setRepository(repository: Repository<T>) {
    this.repository = repository;
  }

  setDataToObject(dataToObject: (body: E, entity?: T) => T) {
    this.dataToObject = dataToObject;
  }

  async createAction(event: APIGatewayEvent & { body: E }) {
    const entity = this.dataToObject(event.body);

    try {
      const result = await this.service.create(entity);
      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);
      return MessageUtil.error(err.code, err.message);
    }
  }

   async updateAction (event: APIGatewayEvent & { body: E }) {
    const id: number = Number(event.pathParameters.id);
    let entity: T = await this.service.findOneById(id);
    entity = this.dataToObject(event.body, entity);

    try {
      const result = await this.service.update(entity);
      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);
      return MessageUtil.error(err.code, err.message);
    }
  }

  async findAllAction (event: APIGatewayEvent) {
    try {
      const status: string|undefined = event.queryStringParameters?.status;

      const where = {
        ...(status && { status }),
      }

      const result = await this.service.find(where);
      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);
      return MessageUtil.error(err.code, err.message);
    }
  }

  async findOneAction (event: APIGatewayEvent) {
    const id: number = Number(event.pathParameters.id);

    try {
      const result = await this.service.findOneById(id);
      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);

      return MessageUtil.error(err.code, err.message);
    }
  }

  async deleteAction (event: APIGatewayEvent) {
    const id: number = Number(event.pathParameters.id);

    try {
      const result = await this.service.deleteOneById(id);

      if (result.affected === 0) {
        return MessageUtil.success({ message: 'The data was not found! May have been deleted!' });
      }

      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);
      return MessageUtil.error(err.code, err.message);
    }
  }

}
