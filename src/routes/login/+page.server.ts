import { json, redirect, type Actions } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import db from '$lib/server/db/db';
import { users } from '$lib/server/db/schema';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (event) => {
	// if (event.locals.auth?.token) {
	// 	redirect(301, '/');
	// }
	return event.locals.auth;
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		let user = await db.query.users.findFirst({
			where: (user, { eq }) => eq(user?.name, form.data.username)
		});
		if (!user) {
			[user] = await db.insert(users).values({ name: form.data.username }).returning();
		}

		const token = await jwt.sign({ username: user.name }, JWT_SECRET);
		event.cookies.set('token', token, { path: '/', httpOnly: false });

		return { form };
	}
} satisfies Actions;
