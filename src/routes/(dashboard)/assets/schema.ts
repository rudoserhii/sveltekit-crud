import { z } from 'zod';

const assetSchema = z.object({
	name: z.string().max(255),
	new_files: z.array(z.instanceof(File)).nullable(),
	old_files: z.array(z.string()).nullable()
});

export default assetSchema;
export type assetSchema = typeof assetSchema;
