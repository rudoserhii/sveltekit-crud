import db from '$lib/server/db/db';
import { instruction_assets, instructions, steps } from '$lib/server/db/schema';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { eq, sql, and, isNull } from 'drizzle-orm';

export const DELETE: RequestHandler = async (event) => {
	const { id } = event.params;

	if (id) {
		await db
			.update(instructions)
			.set({ deleted_at: sql`now()`, deleted_by: event.locals.auth?.userId })
			.where(and(eq(instructions.id, parseInt(id)), isNull(instructions.deleted_at)));

		await db
			.update(steps)
			.set({ deleted_at: sql`now()`, deleted_by: event.locals.auth?.userId })
			.where(and(eq(steps.instruction, parseInt(id)), isNull(steps.deleted_at)));

		await db.delete(instruction_assets).where(eq(instruction_assets.instruction_id, parseInt(id)));

		return json({ success: true });
	}

	return error(404, { message: 'instruction not found' });
};
