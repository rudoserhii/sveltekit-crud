import type { Actions } from '@sveltejs/kit';
import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import stepSchema from './schema';
import { writeFileSync } from 'fs';
import crypto from 'crypto';
import { steps, instructions } from '$lib/server/db/schema';
import db from '$lib/server/db/db';
import type { PageServerLoad } from './$types';
import { asc, eq, isNull } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	return {
		instructions: await db.query.instructions.findMany({
			with: {
				created_by: true,
				updated_by: true
			},
			where: isNull(instructions.deletedAt),
			orderBy: [asc(instructions.id)]
		}),
		steps: await db.query.steps.findMany({
			with: {
				created_by: true,
				updated_by: true
			},
			where: isNull(steps.deletedAt),
			orderBy: [asc(steps.id)]
		})
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(stepSchema));
		if (!form.valid) {
			return fail(400, { form, step: {} as typeof step });
		}

		const file = form.data.attached_file as File;
		const fileExtension = file.name.split('.').reverse()[0];

		const outputFileName = `${crypto.randomUUID()}.${fileExtension}`;

		writeFileSync(`static/uploads/${outputFileName}`, Buffer.from(await file.arrayBuffer()));

		let [{ id }] = await db
			.insert(steps)
			.values({
				// @ts-ignore
				description: form.data.description,
				title: form.data.title,
				step_nr: form.data.step_nr,
				created_by: event.locals.auth?.userId,
				updated_by: event.locals.auth?.userId,
				attached_file: `/uploads/${outputFileName}`,
				instruction: form.data.instruction,
				type: form.data.type
			})
			.returning();

		let step = await db.query.steps.findFirst({
			where: eq(steps.id, id),
			with: {
				created_by: true,
				updated_by: true
			}
		});

		return withFiles({ form, step });
	}
} satisfies Actions;
