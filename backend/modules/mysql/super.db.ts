import { Pool, PoolConnection } from "mysql";

export class SuperDb {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  protected getConnection(connectionConsumer: (connection: PoolConnection) => void) {
    this.pool.getConnection((err, connection) => {
      connectionConsumer(connection);
    })
  }

  protected query(options: string, values: (string | number)[], resultConsumer: (result: any) => void) {
    this.getConnection(connection => connection.query(options, values, (err, result) => {
      resultConsumer(result);
    }));
  }
}