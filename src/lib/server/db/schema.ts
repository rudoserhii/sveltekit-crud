import { relations } from 'drizzle-orm';
import { pgTable, serial, text, integer, varchar, timestamp, json } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull()
});

export const instructions = pgTable('instructions', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description').notNull(),
	duration: integer('duration').notNull(),
	preview_file: varchar('preview_file', { length: 255 }).notNull(),
	created_by: integer('created_by')
		.notNull()
		.references(() => users.id),
	updated_by: integer('updated_by')
		.notNull()
		.references(() => users.id),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date()),
	deletedAt: timestamp('deleted_at', { withTimezone: true })
});
export const instructionsRelations = relations(instructions, ({ one, many }) => ({
	created_by: one(users, { fields: [instructions.created_by], references: [users.id] }),
	updated_by: one(users, { fields: [instructions.updated_by], references: [users.id] }),
	steps: many(steps),
	instruction_assets: many(instruction_assets)
}));

export const steps = pgTable('steps', {
	id: serial('id').primaryKey(),
	type: varchar('type', { length: 50 }).notNull(),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description').notNull(),
	step_nr: integer('step_nr').notNull(),
	attached_file: varchar('attached_file', { length: 255 }),
	instruction: integer('instruction_id')
		.notNull()
		.references(() => instructions.id, { onDelete: 'cascade' }),
	deletedAt: timestamp('deleted_at', { withTimezone: true }),
	created_by: integer('created_by')
		.notNull()
		.references(() => users.id),
	updated_by: integer('updated_by')
		.notNull()
		.references(() => users.id)
});
export const stepsRelations = relations(steps, ({ one }) => ({
	created_by: one(users, { fields: [steps.created_by], references: [users.id] }),
	updated_by: one(users, { fields: [steps.updated_by], references: [users.id] }),
	instruction: one(instructions, {
		fields: [steps.instruction],
		references: [instructions.id]
	})
}));

export const assets = pgTable('assets', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	asset_file: json('asset_file').notNull(), // Storing multiple files as JSON
	deletedAt: timestamp('deleted_at', { withTimezone: true }),
	created_by: integer('created_by')
		.notNull()
		.references(() => users.id),
	updated_by: integer('updated_by')
		.notNull()
		.references(() => users.id)
});
export const assetsRelations = relations(assets, ({ one }) => ({
	created_by: one(users, { fields: [assets.created_by], references: [users.id] }),
	updated_by: one(users, { fields: [assets.updated_by], references: [users.id] })
}));

export const instruction_assets = pgTable('instruction_assets', {
	instruction_id: integer('instruction_id')
		.notNull()
		.references(() => instructions.id, { onDelete: 'cascade' }),
	asset_id: integer('asset_id')
		.notNull()
		.references(() => assets.id, { onDelete: 'cascade' })
});
export const instructionAssetsRelations = relations(instruction_assets, ({ one }) => ({
	instruction: one(instructions, {
		fields: [instruction_assets.instruction_id],
		references: [instructions.id]
	})
}));

export const models = {
	users,
	instructions,
	steps,
	assets,
	instruction_assets,
	instructionsRelations,
	stepsRelations,
	assetsRelations,
	instructionAssetsRelations
};
