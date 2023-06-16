
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const LanguageSchema = z.object({
  languageCode: z.string(),
  name:z.string(),
  translation: z.object({
    name: z.string(),
    subtitle: z.string(),
    description: z.string(),
  }),
});

export const ProductSchema = z.object({
  name: z.string().min(3, {message:"Name must be at least 3 characters long"}).refine(value=>value.trim().length>0,
  {message:"Name must be at least 3 characters long"}),
  subtitle: z.string().min(4,{message:"Name must be at least 4 characters long"}).refine(value=>value.trim().length>0,
  {message:"Name must be at least 4 characters long"}),
  description: z.string().min(20,{message:"Name must be at least 20 characters long"}).refine(value=>value.trim().length>0,
  {message:"Name must be at least 20 characters long"}),
  price: z.number().refine(value=> value>=0, {message:"invalid value" }),
  translations: z.array(LanguageSchema)
});

const TranslationSchema = z.object({
  productId:z.number(),
  language:LanguageSchema,

})

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
    }),
    createTranslateProduct:publicProcedure.input(TranslationSchema).mutation(
      async ({input,ctx})=>{
        const product = await ctx.db.product.findFirst({
          where:{
            id:input.productId
          }
        })

        if(!product){
          throw new Error("product not found")
        }

        const language = await ctx.db.language.findFirst({
          where:{
            code:input.language.languageCode
          }
        })

        if(!language){
          const newLanguage = await ctx.db.language.create({
            data:{
              code:input.language.languageCode,
              name:input.language.name
            }
          })
          
        const translation = await ctx.db.translation.create({
          data:{
            description:input.language.translation.description,
            name:input.language.translation.name,
            subtitle:input.language.translation.subtitle,
            languageId:newLanguage.id,
            productId:product.id
          }
        })

        return translation
        }


        const translation = await ctx.db.translation.create({
          data:{
            description:input.language.translation.description,
            name:input.language.translation.name,
            subtitle:input.language.translation.subtitle,
            languageId:language.id,
            productId:product.id
          }
        })
        return translation
      }
    )
});
