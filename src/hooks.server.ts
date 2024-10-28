import { JWT_SECRET } from '$env/static/private';
import db from '$lib/server/db/db';
import type { Handle } from '@sveltejs/kit';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = parse(event.request.headers.get('cookie') || '');
	const token = cookies.token;

	if (!token) {
		return await resolve(event);
	}

	const result = jwt.verify(token, JWT_SECRET) as { username: string };

	let user;

	if (result.username) {
		user = await db.query.users.findFirst({
			where: (user, { eq }) => eq(user.name, result.username)
		});
		if (user) {
			event.locals.auth = { username: result.username, userId: user.id, token: token || '' };
		} else {
			event.locals.auth = { username: result.username, token };
		}
	}

	return await resolve(event);
};
