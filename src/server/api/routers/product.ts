
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const LanguageSchema = z.object({
  languageCode: z.string(),
  translation: z.object({
    name: z.string(),
    subtitle: z.string(),
    description: z.string(),
  }),
});

const ProductSchema = z.object({
  name: z.string(),
  subtitle: z.string(),
  description: z.string(),
  price: z.number(),
  translations: z.array(LanguageSchema),
});

export const productRouter = createTRPCRouter({
  create: publicProcedure
    .input(ProductSchema)
    .mutation(async ({ input, ctx }) => {
     const product = await ctx.db.product.create({
        data: {
          description: input.description,
          name: input.name,
          price: input.price,
         subtitle: input.subtitle,
        },
     });
      return product;
    })
});
