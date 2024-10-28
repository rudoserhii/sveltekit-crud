import type { Actions } from '@sveltejs/kit';
import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import instructionSchema from './schema';
import { writeFileSync } from 'fs';
import crypto from 'crypto';
import { instructions } from '$lib/server/db/schema';
import db from '$lib/server/db/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		instructions: await db.query.instructions.findMany({
			with: {
				created_by: true,
				updated_by: true
			}
		})
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(instructionSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const file = form.data.preview_file;
		const fileExtension = file.name.split('.').reverse()[0];

		const outputFileName = `${crypto.randomUUID()}.${fileExtension}`;

		writeFileSync(`static/uploads/${outputFileName}`, Buffer.from(await file.arrayBuffer()));

		await db.insert(instructions).values({
			// @ts-ignore
			description: form.data.description,
			duration: form.data.duration,
			title: form.data.title,
			created_by: event.locals.auth?.userId,
			updated_by: event.locals.auth?.userId,
			preview_file: `/uploads/${outputFileName}`
		});

		return withFiles({ form });
	}
} satisfies Actions;
