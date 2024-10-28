import { JWT_SECRET } from '$env/static/private';
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

	event.locals.auth = { username: result.username, token: token || '' };

	return await resolve(event);
};
