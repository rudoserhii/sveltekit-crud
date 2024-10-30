import type { Actions } from '@sveltejs/kit';
import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import instructionSchema from './schema';
import { writeFileSync } from 'fs';
import crypto from 'crypto';
import { assets, instruction_assets, instructions, steps } from '$lib/server/db/schema';
import db from '$lib/server/db/db';
import type { PageServerLoad } from './$types';
import { asc, eq, isNull } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	return {
		instructions: await db.query.instructions.findMany({
			with: {
				created_by: true,
				updated_by: true,
				steps: {
					where: isNull(steps.deleted_at)
				},
				instruction_assets: true
			},
			where: isNull(instructions.deleted_at),
			orderBy: [asc(instructions.id)]
		}),
		assets: await db.query.assets.findMany({
			where: isNull(assets.deleted_at),
			orderBy: [asc(assets.id)]
		})
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(instructionSchema));
		if (!form.valid) {
			return fail(400, { form, instruction: {} as typeof instruction });
		}

		const file = form.data.preview_file as File;
		const fileExtension = file.name.split('.').reverse()[0];

		const outputFileName = `${crypto.randomUUID()}.${fileExtension}`;

		writeFileSync(`static/uploads/${outputFileName}`, Buffer.from(await file.arrayBuffer()));

		let [{ id }] = await db
			.insert(instructions)
			.values({
				// @ts-ignore
				description: form.data.description,
				duration: form.data.duration,
				title: form.data.title,
				created_by: event.locals.auth?.userId,
				updated_by: event.locals.auth?.userId,
				preview_file: `/uploads/${outputFileName}`
			})
			.returning();

		if (form.data.assets?.length) {
			await db.insert(instruction_assets).values(
				(form.data.assets || []).map((asset_id) => ({
					asset_id: asset_id,
					instruction_id: id
				}))
			);
		}

		let instruction = await db.query.instructions.findFirst({
			where: eq(instructions.id, id),
			with: {
				created_by: true,
				updated_by: true
			}
		});

		return withFiles({ form, instruction });
	}
} satisfies Actions;
