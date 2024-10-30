import type { Actions } from '@sveltejs/kit';
import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import stepSchema from '../schema';
import { writeFileSync } from 'fs';
import crypto from 'crypto';
import { steps } from '$lib/server/db/schema';
import db from '$lib/server/db/db';
import { eq, sql, and, isNull } from 'drizzle-orm';

export const actions = {
	update: async (event) => {
		const { id = '' } = event.params;

		const form = await superValidate(event, zod(stepSchema));
		if (!form.valid) {
			return fail(400, { form, step: {} as typeof step });
		}

		let file = form.data.attached_file;
		if (file instanceof File) {
			const fileExtension = file.name.split('.').reverse()[0];

			const outputFileName = `${crypto.randomUUID()}.${fileExtension}`;

			writeFileSync(`static/uploads/${outputFileName}`, Buffer.from(await file.arrayBuffer()));

			file = `/uploads/${outputFileName}`;
		}

		await db
			.update(steps)
			.set({
				// @ts-ignore
				description: form.data.description,
				title: form.data.title,
				step_nr: form.data.step_nr,
				updated_by: event.locals.auth?.userId,
				attached_file: file,
				instruction: form.data.instruction,
				type: form.data.type
			})
			.where(and(eq(steps.id, parseInt(id)), isNull(steps.deleted_at)))
			.returning();

		let step = await db.query.steps.findFirst({
			where: eq(steps.id, parseInt(id)),
			with: {
				created_by: true,
				updated_by: true
			}
		});

		return withFiles({ form, step });
	}
} satisfies Actions;
