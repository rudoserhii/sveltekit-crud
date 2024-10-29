import { z } from 'zod';

const assetSchema = z.object({
	id: z.number().int().positive(),
	name: z.string().max(255),
	asset_file: z.array(z.union([z.string(), z.instanceof(File)])).nonempty(),
	deletedAt: z.date().nullable()
});

export default assetSchema;
export type assetSchema = typeof assetSchema;
