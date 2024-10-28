import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_URL } from '$env/static/private';
import pg from 'pg';
import { users } from './schema';

const pool = new pg.Pool({
	connectionString: DATABASE_URL
});
const db = drizzle({ client: pool, schema: { users } });

export default db;
