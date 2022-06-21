import { Repository, DeleteResult } from 'typeorm';

export class Service<T> {
  public repository: Repository<T>;
  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  public async create (entity: T): Promise<T> {
    try {
      const result = await this.repository.save(entity);
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public update (entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  public find (where?: { [key: string]: any }, options?: { [key: string]: string[] }): Promise<T[]> {
    let filters: object = { ...options }
    // let filters: object = { relations: ["themes"] }

    if (where) {
      filters = {
        ...filters,
        where: where,
      };
    }

    return this.repository.find(filters);
  }

  public findOneById (id: number, options: { [key: string]: string[]} = {}): Promise<T> {
     // @ts-ignore
    return this.repository.findOne({ where: { id }, ...options });
  }

  public findOneBySlug (slug: string, options: { [key: string]: string[]} = {}): Promise<T> {
    // @ts-ignore
   return this.repository.findOne({ where: { slug }, ...options });
 }

  public deleteOneById (id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
