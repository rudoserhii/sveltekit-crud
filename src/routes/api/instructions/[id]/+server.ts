import db from '$lib/server/db/db';
import { instructions } from '$lib/server/db/schema';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { eq, sql, and, isNull } from 'drizzle-orm';

import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import instructionSchema from '../../../(dashboard)/instructions/schema';

export const DELETE: RequestHandler = async (event) => {
	const { id } = event.params;

	if (id) {
		await db
			.update(instructions)
			.set({ deletedAt: sql`now()` })
			.where(and(eq(instructions.id, parseInt(id)), isNull(instructions.deletedAt)));
		return json({ success: true });
	}

	return error(404, { message: 'instruction not found' });
};
