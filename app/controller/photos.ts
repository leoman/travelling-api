import { Repository, DataSource } from 'typeorm';

import { Post, Photo, photoDataToObject, PhotoDTO } from '../model';
import { PhotoService } from '../service/photos';
import { BaseController } from './base';
import { MessageUtil } from '../utils/message';
import { PhotoEvent } from '../types';


export class PhotosController extends BaseController<Photo, PhotoDTO> {
  constructor (repository: Repository<Photo>) {
    super(repository);

    const photoService = new PhotoService(repository);

    this.setDataToObject(photoDataToObject);
    this.setService(photoService);
  }

  async createAction(event: PhotoEvent, connection?: DataSource) {
    const { postId } = event.body;
    const photoRepo = connection.getRepository(Post);

    const post = await photoRepo.findOne({ where: { id: Number(postId) }})

    if (!post) {
      throw new Error(`No post was found using ID: ${postId}`);
    }

    const photo = this.dataToObject(event.body, null, post);

    try {
      const result = await this.service.create(photo);
      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);
      return MessageUtil.error(err.code, err.message);
    }
  }

}
