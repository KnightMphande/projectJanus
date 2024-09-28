import "dotenv/config";
import Pool from "pg";

export const PoolConstructor = Pool.Pool;
const client = new PoolConstructor({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASS,
  port: process.env.PORT_DB,
  ssl: false,
});

export default client;