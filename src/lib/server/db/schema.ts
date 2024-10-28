import { relations } from 'drizzle-orm';
import { pgTable, serial, text, integer, varchar, timestamp, json } from 'drizzle-orm/pg-core';

// User model
export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull()
});

// Instruction model
export const instructions = pgTable('instructions', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description').notNull(),
	duration: integer('duration').notNull(),
	preview_file: varchar('preview_file', { length: 255 }).notNull(), // Assuming file path or URL
	created_by: integer('created_by')
		.notNull()
		.references(() => users.id),
	updated_by: integer('updated_by')
		.notNull()
		.references(() => users.id),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
});
export const instructionsRelations = relations(instructions, ({ one }) => ({
	created_by: one(users, { fields: [instructions.created_by], references: [users.id] }),
	updated_by: one(users, { fields: [instructions.updated_by], references: [users.id] })
}));

// Step model
export const steps = pgTable('steps', {
	id: serial('id').primaryKey(),
	type: varchar('type', { length: 50 }).notNull(), // e.g., 'image', 'video', 'pdf', 'text'
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description').notNull(), // Rich text can be stored as text
	step_nr: integer('step_nr').notNull(),
	attached_file: varchar('attached_file', { length: 255 }).notNull(), // Assuming file path or URL
	instruction_id: integer('instruction_id')
		.notNull()
		.references(() => instructions.id) // Foreign key
});

// Asset model
export const assets = pgTable('assets', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	asset_file: json('asset_file').notNull() // Storing multiple files as JSON
});

// Instruction-Asset relation table
export const instruction_assets = pgTable('instruction_assets', {
	instruction_id: integer('instruction_id')
		.notNull()
		.references(() => instructions.id),
	asset_id: integer('asset_id')
		.notNull()
		.references(() => assets.id)
});

// Exporting all models for use
export const models = {
	users,
	instructions,
	steps,
	assets,
	instruction_assets,
	instructionsRelations
};
