import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.ENV_PATH });

let buff = new Buffer(process.env.DB_CA_CERT, 'base64');
let cert = buff.toString('ascii');

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
  awsChime: {
    config: {
      accessKeyId: env('AWS_CHIME_ACCESS_KEY_ID'),
      secretAccessKey: env('AWS_CHIME_SECRET_ACCESS_KEY'),
    },
    region: env('AWS_CHIME_REGION'),
    appInstanceArn: env('AWS_CHIME_APP_ARN'),
    appInstanceAdminArn: env('AWS_CHIME_ADMIN_ARN'),
  },
  client: {
    baseUrl: env('CLIENT_BASE_URL', 'http://test.orysx.com'),
    emailUrls: {
      sessionCollaboratorInvite: env('CLIENT_COLLABORATE_URL'),
    },
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
        ? {
            ca: cert.toString(),
          }
        : false,
    },
    redis: {
      host: env('REDIS_HOST', 'localhost'),
      port: Number(env('REDIS_PORT', '80')),
      password: env('REDIS_PASSWORD'),
    },
  },
  jwt: {
    secret: env('SECRET_KEY', 'MyJwtSecret'),
    signOptions: {
      expiresIn: Number(env('EXPIRY_TIME_SEC', 15 * 60)),
    },
    refreshToken: {
      expiresIn: Number(env('REFRESH_EXPIRY_TIME_SEC', 3 * 60 * 60)), // 3 hrs
    },
  },
  sendGrid: {
    apiKey: env('SENDGRID_API_KEY'),
    from: {
      name: env('APP_EMAIL_SENDER_NAME'),
      address: env('APP_EMAIL_SENDER_ADDRESS'),
    },
  },
  sentry: {
    dsn: env('SENTRY_DNS'),
    debug: env('SENTRY_DEBUG') === 'true',
    tracesSampleRate: 1.0,
  },
  storage: {
    s3: {
      accessKeyId: env('AWS_S3_ACCESS_KEY_ID'),
      secretAccessKey: env('AWS_S3_SECRET_ACCESS_KEY'),
      region: env('AWS_S3_REGION'),
    },
  },
};

export default () => config;
