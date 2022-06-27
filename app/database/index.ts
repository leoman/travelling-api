import "reflect-metadata";
import { DataSource  } from 'typeorm';
import { Post, Trip, Location, Photo } from "../model";

export const dataSource = new DataSource({
  type: "postgres",
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  synchronize: false,
  logging: false,
  entities: [
    Post,
    Trip,
    Location,
    Photo
  ],
});

export class Database {

  private dataSource: DataSource;

  constructor() {
    this.dataSource = dataSource;
  }

  public async getConnection(): Promise<DataSource> {

    if (!this.dataSource.isInitialized) {
      try {
        await this.dataSource.initialize();
        return this.dataSource;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  
    return  this.dataSource;
  }
}
