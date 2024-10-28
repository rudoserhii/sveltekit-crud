import { z } from 'zod';

const instructionSchema = z.object({
	id: z.number().optional(),
	title: z.string().max(255),
	description: z.string(),
	duration: z.number(),
	preview_file: z.union([
		z.instanceof(File).refine((file) => file.size > 0, {
			message: 'Please upload a valid file.'
		}),
		z.string().min(1, { message: 'Please provide a valid string.' })
	])
});

export default instructionSchema;
