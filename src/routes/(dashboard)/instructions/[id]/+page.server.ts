import type { Actions } from '@sveltejs/kit';
import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import instructionSchema from '../schema';
import { writeFileSync } from 'fs';
import crypto from 'crypto';
import { instruction_assets, instructions } from '$lib/server/db/schema';
import db from '$lib/server/db/db';
import { eq, sql, and, isNull } from 'drizzle-orm';

export const actions = {
	update: async (event) => {
		const { id = '' } = event.params;

		const form = await superValidate(event, zod(instructionSchema));
		if (!form.valid) {
			return fail(400, { form, instruction: {} as typeof instruction });
		}

		let file = form.data.preview_file;
		if (file instanceof File) {
			const fileExtension = file.name.split('.').reverse()[0];

			const outputFileName = `${crypto.randomUUID()}.${fileExtension}`;

			writeFileSync(`static/uploads/${outputFileName}`, Buffer.from(await file.arrayBuffer()));

			file = `/uploads/${outputFileName}`;
		}

		await db
			.update(instructions)
			.set({
				// @ts-ignore
				description: form.data.description,
				duration: form.data.duration,
				title: form.data.title,
				updated_by: event.locals.auth?.userId,
				preview_file: file
			})
			.where(and(eq(instructions.id, parseInt(id)), isNull(instructions.deleted_at)))
			.returning();

		await db.delete(instruction_assets).where(eq(instruction_assets.instruction_id, parseInt(id)));
		if (form.data.assets?.length) {
			await db.insert(instruction_assets).values(
				(form.data.assets || []).map((asset_id) => ({
					asset_id: asset_id,
					instruction_id: parseInt(id)
				}))
			);
		}

		let instruction = await db.query.instructions.findFirst({
			where: eq(instructions.id, parseInt(id)),
			with: {
				created_by: true,
				updated_by: true
			}
		});

		return withFiles({ form, instruction });
	}
} satisfies Actions;
