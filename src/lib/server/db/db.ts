import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_URL } from '$env/static/private';
import pg from 'pg';
import { models } from './schema';

const pool = new pg.Pool({
	connectionString: DATABASE_URL
});
const db = drizzle({ client: pool, schema: models });

export default db;
