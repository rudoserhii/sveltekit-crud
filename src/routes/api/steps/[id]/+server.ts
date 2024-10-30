import db from '$lib/server/db/db';
import { steps } from '$lib/server/db/schema';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { eq, sql, and, isNull } from 'drizzle-orm';

export const DELETE: RequestHandler = async (event) => {
	const { id } = event.params;

	if (id) {
		await db
			.update(steps)
			.set({ deleted_at: sql`now()`, deleted_by: event.locals.auth?.userId })
			.where(and(eq(steps.id, parseInt(id)), isNull(steps.deleted_at)));
		return json({ success: true });
	}

	return error(404, { message: 'instruction not found' });
};
