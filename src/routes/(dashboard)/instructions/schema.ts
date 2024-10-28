import { z } from 'zod';

const instructionSchema = z.object({
	id: z.number().optional(),
	title: z.string().max(255),
	description: z.string(),
	duration: z.number(),
	preview_file: z.instanceof(File, { message: 'Please upload a file.' })
});

export default instructionSchema;