import { z } from "zod";

export const DyeSchema = z.object({
  name: z.string(),
  slot: z.number()
})

export const ItemSchema = z.object({
  slot: z.string(),
  id: z.coerce.number(),
  name: z.string().optional(),
  dyes: z.array(DyeSchema).optional(),
  imageUrl: z.string().optional(),
  selected: z.boolean().default(true),
});

export const EquipmentSchema = z.array(ItemSchema)

export const OptionsSchema = z.object({
  customization: z.string().default('')
}).default({customization: ""})

export type Item = z.infer<typeof ItemSchema>;
export type Equipment = z.infer<typeof EquipmentSchema>;
