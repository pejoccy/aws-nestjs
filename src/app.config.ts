import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

// dotenv.config();
dotenv.config({ path: process.env.ENV_PATH });


const env = (key: string, defaultVal: any = undefined) =>
  process.env[key] || defaultVal;

const config = {
  app: {
    host: env('APP_HOST', `http://localhost:${env('PORT', 3001)}`),
    api: {
      version: env('APP_API_VERSION', 'api/v1'),
    },
    environment: env('NODE_ENV'),
    port: Number(env('APP_PORT', 3001)),
  },
  db: {
    pgsql: {
      type: 'postgres',
      host: env('DATABASE_HOST'),
      port: Number(env('DATABASE_PORT')),
      username: env('DATABASE_USERNAME'),
      password: env('DATABASE_PASSWORD'),
      database: env('DATABASE_NAME'),
      autoLoadEntities: true,
      synchronize: false,
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      migrations: [`${__dirname}/database/migrations/*{.ts,.js}`],
      logging: env('NODE_ENV') !== 'production',
      cli: {
        migrationsDir: './database/migrations',
      },
      ssl: ['staging', 'production'].includes(env('NODE_ENV'))
        ? { ca: readFileSync(env('CERT_PATH')).toString() }
        : false,
    },
    redis: {
      host: "http://" + env('REDIS_HOST', 'localhost'),
      port: Number(env('REDIS_PORT', '6379')),
      password: env('REDIS_PASSWORD'),
      refreshThreshold: parseInt(env('CACHE_TTL')),
    },
  },
  jwt: {
    secret: env('SECRET_KEY', 'MyJwtSecret'),
    secretOrPrivateKey: env('SECRET_KEY', 'MyJwtSecret'),
    signOptions: {
      expiresIn: env('EXPIRY_TIME_SEC', 30 * 60),
    },
  },
  sendGrid: {
    apiKey: env('SENDGRID_API_KEY'),
    from: {
      name: env('APP_EMAIL_SENDER_NAME'),
      address: env('APP_EMAIL_SENDER_ADDRESS'),
    },
  },
  messaging: {
    sms: {
      provider: 'dot_go',
      dotGo: {
        accountId: env('DOT_GO_ACCOUNT_ID'),
        apiToken: env('DOT_GO_API_TOKEN'),
        baseURL: env('DOT_GO_BASE_URL'),
        senderMask: env('DOT_GO_SENDER_MASK'),
      },
      hollaTags: {
        user: env('HOLLATAGS_USER'),
        pass: env('HOLLATAGS_PASS'),
        baseURL: env('HOLLATAGS_BASE_URL'),
        senderMask: env('HOLLATAGS_SENDER_MASK'),
      },
    },
    whatsapp: {},
    richsms: {},
  },
  sentry: {
    dsn: env('SENTRY_DNS'),
    debug: env('SENTRY_DEBUG') === 'true',
    tracesSampleRate: 1.0,
  },
};

export default () => config;
