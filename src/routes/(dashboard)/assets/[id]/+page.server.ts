import type { Actions } from '@sveltejs/kit';
import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import assetsSchema from '../schema';
import { writeFileSync } from 'fs';
import crypto from 'crypto';
import { assets } from '$lib/server/db/schema';
import db from '$lib/server/db/db';
import { eq, sql, and, isNull } from 'drizzle-orm';

export const actions = {
	update: async (event) => {
		const { id = '' } = event.params;

		const form = await superValidate(event, zod(assetsSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const files = form.data.new_files as File[];
		const outputFiles = [];

		for (const file of files) {
			const fileExtension = file.name.split('.').reverse()[0];

			const outputFileName = `${crypto.randomUUID()}.${fileExtension}`;

			writeFileSync(`static/uploads/${outputFileName}`, Buffer.from(await file.arrayBuffer()));

			outputFiles.push(`/uploads/${outputFileName}`);
		}

		await db
			.update(assets)
			.set({
				// @ts-ignore
				name: form.data.name,
				asset_file: [...outputFiles, ...(form.data.old_files || [])],
				updated_by: event.locals.auth?.userId
			})
			.where(and(eq(assets.id, parseInt(id)), isNull(assets.deleted_at)))
			.returning();

		return withFiles({ form });
	}
} satisfies Actions;
