import { z } from 'zod';

const instructionSchema = z.object({
	id: z.number().optional(),
	title: z.string().max(255),
	description: z.string(),
	duration: z.number(),
	preview_file: z.string().max(255)
});

export default instructionSchema;
