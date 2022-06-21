import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn } from "typeorm";
import slugify from 'slugify';
import { Post } from './posts';
import { TripDTOType } from '../types';

export enum TripStatus {
  DRAFT = "draft",
  LIVE = "live",
}

export interface TripDTO {
  name: string;
  status: TripStatus;
}

export const tripDataToObject: TripDTOType = (
  {
    name,
    status,
  }: TripDTO,
  current?: Trip
): Trip => {
  let trip = new Trip();
  if (current) {
    trip = current;
  }
  trip.name = name;
  trip.status = status;

  return trip;
};

@Entity()
export class Trip {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    slug: string;

    @Column({
      type: "enum",
      enum: TripStatus,
      default: TripStatus.DRAFT
    })
    status: TripStatus;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @BeforeInsert()
    @BeforeUpdate()
    updateDates() {
      this.slug = slugify(this.name.toLowerCase())
    }

    @OneToMany(() => Post, post => post.trip, {
      cascade: false
    })
    posts: Post[];
}