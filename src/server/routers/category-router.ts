import { db } from "@/db";
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators/CategoryValidator";
import { startOfMonth } from "date-fns";
import { z } from "zod";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";
import { parseColor } from "@/utils";
import { HTTPException } from "hono/http-exception";

export const categoryRouter = router({
  getEventCategories: privateProcedure.query(async ({ c, ctx }) => {
    const categories = await db.eventCategory.findMany({
      where: { userId: ctx.user.id },
      select: {
        id: true,
        name: true,
        emoji: true,
        color: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const now = new Date();
        const firstDayOfMonth = startOfMonth(now);

        const [uniqueFieldsCount, eventCount, lastEvent] = await Promise.all([
          db.event
            .findMany({
              where: {
                EventCategory: { id: category.id },
                createdAt: { gte: firstDayOfMonth },
              },
              select: { fields: true },
              distinct: ["fields"],
            })
            .then((events) => {
              const fields = new Set<string>();
              events.forEach((event) => {
                Object.keys(event.fields as Object).forEach((fieldName) => {
                  fields.add(fieldName);
                });
              });

              return fields.size;
            }),

          db.event.count({
            where: {
              EventCategory: { id: category.id },
              createdAt: { gte: firstDayOfMonth },
            },
          }),

          db.event.findFirst({
            where: {
              EventCategory: { id: category.id },
            },
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
          }),
        ]);

        return {
          ...category,
          uniqueFieldsCount,
          eventCount,
          lastEvent: lastEvent?.createdAt || null,
        };
      })
    );

    return c.superjson({
      categories: categoriesWithCounts,
    });
  }),

  deleteCategory: privateProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ c, input, ctx }) => {
      const { name } = input;

      await db.eventCategory.delete({
        where: { name_userId: { name, userId: ctx.user.id } },
      });

      return c.json({ success: true });
    }),

  createEventCategory: privateProcedure
    .input(
      z.object({
        name: CATEGORY_NAME_VALIDATOR,
        color: z
          .string()
          .min(1, "Color is required")
          .regex(/^#[0-9A-F]{6}$/i, "Invalid color format."),
        emoji: z.string().emoji("Invalid emoji").optional(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx;
      const { color, name, emoji } = input;

      const eventCategory = await db.eventCategory.create({
        data: {
          name: name.toLowerCase(),
          color: parseColor(color),
          emoji,
          userId: user.id,
        },
      });

      return c.json({ eventCategory });
    }),

  insertQuickStartCategory: privateProcedure.mutation(async ({ c, ctx }) => {
    const categories = await db.eventCategory.createMany({
      data: [
        { name: "Bug", emoji: "🐛", color: 0xff6b6b },
        { name: "Sale", emoji: "💸", color: 0xffeb3b },
        { name: "Question", emoji: "❓", color: 0x6c5ce7 },
      ].map((category) => ({
        ...category,
        userId: ctx.user.id,
      })),
    });

    return c.json({ success: true, count: categories.count });
  }),
});
