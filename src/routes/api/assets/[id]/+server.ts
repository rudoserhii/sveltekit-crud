import db from '$lib/server/db/db';
import { assets } from '$lib/server/db/schema';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { eq, sql, and, isNull } from 'drizzle-orm';

export const DELETE: RequestHandler = async (event) => {
	const { id } = event.params;

	if (id) {
		await db
			.update(assets)
			.set({ deletedAt: sql`now()` })
			.where(and(eq(assets.id, parseInt(id)), isNull(assets.deletedAt)));
		return json({ success: true });
	}

	return error(404, { message: 'asset not found' });
};
