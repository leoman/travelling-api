import "reflect-metadata";
import { Database } from '../../database'
import { Request } from '../../types';

export default () => {
  const closeDb = async (request: Request): Promise<void> => {
    if (request.context.connection) {
      console.info(`Closing DB connection`);
      await request.context.connection.close();
    }
  };
  return {
    before: async (request: Request): Promise<void> => {
      console.info(`Opening DB connection`);

      const database = new Database();
      const connection = await database.getConnection();

      request.context.connection = connection
      console.info(`Done opening DB connection`);
    },
    after: closeDb,
    onError: closeDb,
  };
};