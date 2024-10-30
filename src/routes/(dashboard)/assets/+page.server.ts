import type { Actions } from '@sveltejs/kit';
import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import assetschema from './schema';
import { writeFileSync } from 'fs';
import crypto from 'crypto';
import { assets } from '$lib/server/db/schema';
import db from '$lib/server/db/db';
import type { PageServerLoad } from './$types';
import { asc, isNull } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	return {
		assets: await db.query.assets.findMany({
			with: {
				created_by: true,
				updated_by: true
			},
			where: isNull(assets.deleted_at),
			orderBy: [asc(assets.id)]
		})
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(assetschema));
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

		let [{ id }] = await db
			.insert(assets)
			.values({
				// @ts-ignore
				name: form.data.name,
				asset_file: [...outputFiles, ...(form.data.old_files || [])],
				created_by: event.locals.auth?.userId,
				updated_by: event.locals.auth?.userId
			})
			.returning();

		return withFiles({ form });
	}
} satisfies Actions;
