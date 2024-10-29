import { z } from 'zod';
import stepSchema from '../steps/schema';

const instructionSchema = z.object({
	id: z.number().optional(),
	title: z.string().max(255),
	description: z.string(),
	duration: z.number(),
	preview_file: z.union([
		z.instanceof(File).refine(
			(file) => {
				const allowedTypes = ['image/'];
				const mimeType = file.type;

				return allowedTypes.some((type) => mimeType.startsWith(type)) && file.size > 0;
			},
			{
				message: 'Please upload a valid file.'
			}
		),
		z.string().min(1, { message: 'Please provide a valid string.' })
	]),
	steps: z.array(stepSchema).optional(),
	assets: z.array(z.number()).optional()
});

export default instructionSchema;
