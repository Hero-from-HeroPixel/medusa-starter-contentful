const dotenv = require('dotenv');

let ENV_FILE_NAME = '';
switch (process.env.NODE_ENV) {
	case 'production':
		ENV_FILE_NAME = '.env.production';
		break;
	case 'staging':
		ENV_FILE_NAME = '.env.staging';
		break;
	case 'test':
		ENV_FILE_NAME = '.env.test';
		break;
	case 'development':
	default:
		ENV_FILE_NAME = '.env';
		break;
}

try {
	dotenv.config({ path: process.cwd() + '/' + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS = process.env.ADMIN_CORS || 'http://localhost:7000,http://localhost:7001';

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || 'http://localhost:8000';

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_DATABASE = process.env.DB_DATABASE;
console.log(DB_DATABASE);

const DATABASE_URL =
	`postgres://${DB_USERNAME}:${DB_PASSWORD}` + `@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

console.log(DATABASE_URL);

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID || '';
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN || '';
const CONTENTFUL_ENV = process.env.CONTENTFUL_ENV || '';

const plugins = [
	`medusa-fulfillment-manual`,
	`medusa-payment-manual`,
	{
		resolve: `@medusajs/file-local`,
		options: {
			upload_dir: 'uploads',
		},
	},
	// To enable the admin plugin, uncomment the following lines and run `yarn add @medusajs/admin`
	// {
	// 	resolve: '@medusajs/admin',
	// 	/** @type {import('@medusajs/admin').PluginOptions} */
	// 	options: {
	// 		autoRebuild: true,
	// 	},
	// },
	{
		resolve: `medusa-plugin-contentful`,
		options: {
			space_id: CONTENTFUL_SPACE_ID,
			access_token: CONTENTFUL_ACCESS_TOKEN,
			environment: CONTENTFUL_ENV,
		},
	},
];

const modules = {
	eventBus: {
		resolve: '@medusajs/event-bus-redis',
		options: {
			redisUrl: REDIS_URL,
		},
	},
	cacheService: {
		resolve: '@medusajs/cache-redis',
		options: {
			redisUrl: REDIS_URL,
			ttl: 3600,
		},
	},
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
	jwtSecret: process.env.JWT_SECRET,
	cookieSecret: process.env.COOKIE_SECRET,
	store_cors: STORE_CORS,
	database_url: DATABASE_URL,
	admin_cors: ADMIN_CORS,
	// Uncomment the following lines to enable REDIS
	redis_url: REDIS_URL,
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
	projectConfig,
	plugins,
	modules,
};
