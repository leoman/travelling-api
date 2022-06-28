import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import slugify from 'slugify'
import { Trip } from './trips';
import { Location, LocationDTO } from './locations';
import { Photo } from './photos';

export enum Status {
  DRAFT = "draft",
  LIVE = "live",
}

export interface PostDTO {
  trip: Trip;
  title: string;
  titleColour: string;
  content?: string;
  date: Date;
  order: Date;
  photo?: string;
  status: Status;
  location: LocationDTO
  themes?: number[];
}

export const dataToObject = (
  {
    title,
    titleColour,
    content,
    date,
    order,
    photo,
    status,
  }: PostDTO,
  currentPost?: Post,
  location?: Location,
  trip?: Trip,
): Post => {
  let post = new Post();
  if (currentPost) {
    post = currentPost;
  }
  post.title = title;
  post.titleColour = titleColour;
  post.content = content;
  post.date = date;
  post.order = order;
  post.photo = photo;
  post.status = status;
  post.location = location;
  
  if (trip) {
    post.trip = trip;
  }

  return post;
};

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    title: string;

    @Column()
    slug: string;

    @Column({
      nullable: true,
    })
    titleColour: string;

    @Column({
      type: 'text',
      nullable: true,
    })
    content: string;

    @Column()
    date: Date;

    @Column()
    order: Date;

    @Column({
      nullable: true,
    })
    photo: string;

    @Column({
      type: "enum",
      enum: Status,
      default: Status.DRAFT
    })
    status: Status;

    @BeforeInsert()
    @BeforeUpdate()
    updateDates() {
      this.slug = slugify(this.title.toLowerCase())
    }

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => Trip, trip => trip.posts, {})
    trip: Trip;

    @OneToMany(() => Photo, photo => photo.post, {
      onDelete: "CASCADE",
      cascade: ["insert", "update"],
    })
    photos: Photo[];

    @OneToOne(() => Location, (location) => location.post, {
      onDelete: "CASCADE",
      cascade: ["insert", "update"],
    })
    location: Location;
    
}