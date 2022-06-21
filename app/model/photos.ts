import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Post } from './posts';
import { PhotoDTOType } from '../types';

export interface PhotoDTO {
  postId: number;
  url: string;
}

export const photoDataToObject: PhotoDTOType = (
  {
    url,
  }: PhotoDTO,
  currentPhoto?: Photo,
  post?: Post
) => {
  let photo = new Photo();
  if (currentPhoto) { photo = currentPhoto; }
  if (post) { photo.post = post; }

  photo.url = url;

  return photo;
};

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => Post, post => post.photos, {})
    post: Post;
}