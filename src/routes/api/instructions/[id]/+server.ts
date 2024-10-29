import db from '$lib/server/db/db';
import { instruction_assets, instructions, steps } from '$lib/server/db/schema';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { eq, sql, and, isNull } from 'drizzle-orm';

export const DELETE: RequestHandler = async (event) => {
	const { id } = event.params;

	if (id) {
		await db
			.update(instructions)
			.set({ deletedAt: sql`now()` })
			.where(and(eq(instructions.id, parseInt(id)), isNull(instructions.deletedAt)));

		await db
			.update(steps)
			.set({ deletedAt: sql`now()` })
			.where(and(eq(steps.instruction, parseInt(id)), isNull(steps.deletedAt)));

		return json({ success: true });
	}

	return error(404, { message: 'instruction not found' });
};
