import type { Actions } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import instructionSchema from './schema';

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(instructionSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
	}
} satisfies Actions;
