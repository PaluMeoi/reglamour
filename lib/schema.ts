import { z } from "zod";

export const DyeSchema = z.object({
  name: z.string(),
  slot: z.number(),
});

export const ItemSchema = z.object({
  slot: z.string(),
  id: z.coerce.number().optional(),
  itemId: z.number().optional(),
  name: z.string().optional(),
  dyes: z.array(DyeSchema).optional(),
  imageUrl: z.string().optional(),
  selected: z.boolean().default(true),
});

export const EquipmentSchema = z.array(ItemSchema);

export const OptionsSchema = z.object({
  customization: z.string().default(""),
}).default({ customization: "" });

export const XivApiSchema = z.object({
  schema: z.string(),
  results: z.array(
    z.object({
      score: z.number(),
      sheet: z.string(),
      row_id: z.number(),
      fields: z.object({
        Icon: z.object({
          id: z.number(),
          path: z.string(),
          path_hr1: z.string(),
        }),
        Name: z.string(),
        Singular: z.string(),
      }),
    }),
  ),
});

export type Item = z.infer<typeof ItemSchema>;
export type Equipment = z.infer<typeof EquipmentSchema>;
export type XivApi = z.infer<typeof XivApiSchema>;
