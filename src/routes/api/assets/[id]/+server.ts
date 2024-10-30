import db from '$lib/server/db/db';
import { assets, instruction_assets } from '$lib/server/db/schema';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { eq, sql, and, isNull } from 'drizzle-orm';

export const DELETE: RequestHandler = async (event) => {
	const { id } = event.params;

	if (id) {
		await db
			.update(assets)
			.set({ deleted_at: sql`now()`, deleted_by: event.locals.auth?.userId })
			.where(and(eq(assets.id, parseInt(id)), isNull(assets.deleted_at)));

		await db.delete(instruction_assets).where(eq(instruction_assets.asset_id, parseInt(id)));

		return json({ success: true });
	}

	return error(404, { message: 'asset not found' });
};
