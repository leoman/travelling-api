import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Post } from './posts';
import { LocationDTOType } from '../types';

export interface LocationDTO {
  id?: number;
  location: string;
  lat: number;
  lng: number;
  duration: number;
  hideFromBounding: boolean;
}

export const locationDataToObject: LocationDTOType = (
  {
    location: name,
    lat,
    lng,
    duration,
    hideFromBounding,
  }: LocationDTO,
  current?: Location
): Location => {
  let location = new Location();
  if (current) {
    location = current;
  }
  location.location = name;
  location.lat = lat;
  location.lng = lng;
  location.duration = duration;
  location.hideFromBounding = hideFromBounding;

  return location;
};

@Entity()
export class Location {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    location: string;

    @Column({ type: 'double precision'})
    lat: number;

    @Column({ type: 'double precision'})
    lng: number;

    @Column({ default: 0 })
    duration: number;

    @Column({ default: false })
    hideFromBounding: boolean;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToOne(() => Post, (post) => post.location, {
      onDelete: "CASCADE",
    })
    @JoinColumn()
    post: Post;
}