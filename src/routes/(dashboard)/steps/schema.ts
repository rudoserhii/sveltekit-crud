import { z } from 'zod';

const stepSchema = z.object({
	instruction: z.number().int().optional(),
	type: z.enum(['image', 'video', 'pdf', 'text']),
	title: z.string().max(255), // Assuming a max length for title
	description: z.string(), // Assuming richtext can be represented as a string
	step_nr: z.number().int().positive(), // Ensuring step number is a positive integer
	attached_file: z.union([
		z
			.instanceof(File)
			.refine(
				(file) => {
					const allowedTypes = ['image/', 'video/', 'application/pdf'];
					const mimeType = file.type;

					return allowedTypes.some((type) => mimeType.startsWith(type)) && file.size > 0;
				},
				{
					message: 'Please upload a valid file.'
				}
			)
			.optional(),
		z.string().min(1, { message: 'Please provide a valid string.' })
	])
});

export type StepSchema = typeof stepSchema;

export default stepSchema;
