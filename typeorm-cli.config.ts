import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.ENV_PATH });

import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['./**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
  logging: false,
  logger: 'advanced-console',
  migrations: ['./src/common/database/migrations/*.ts'],
  ssl: ['staging', 'production'].includes(process.env.NODE_ENV)
    ? {
        rejectUnauthorized: true,
        ca: process.env.DB_CA_CERT,
      }
    : false,
  cli: {
    migrationsDir: './migrations',
  },
};

export = config;
