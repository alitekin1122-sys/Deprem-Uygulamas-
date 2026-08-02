import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Deprem verisi proxy - CORS sorunlarını aşmak için
  earthquake: router({
    today: publicProcedure.query(async () => {
      const now = new Date();
      const start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0
      );
      const end = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59
      );

      const startStr = formatDateTime(start);
      const endStr = formatDateTime(end);

      const url = `https://deprem.afad.gov.tr/apiv2/event/filter?start=${encodeURIComponent(
        startStr
      )}&end=${encodeURIComponent(endStr)}&format=json&orderby=timedesc`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`AFAD API hatası: ${response.status}`);
      }
      const data = await response.json();
      return data;
    }),
  }),
});

function formatDateTime(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

export type AppRouter = typeof appRouter;
