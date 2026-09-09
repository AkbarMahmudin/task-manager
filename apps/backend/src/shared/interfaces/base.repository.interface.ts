export interface IBaseRepository<T, ID = string> {
  create(entity: T): Promise<void>;
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: ID, entity: Partial<T>): Promise<void>;
  delete(id: ID): Promise<void>;
}
