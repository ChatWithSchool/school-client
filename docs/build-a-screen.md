# איך בונים מסך

1. **מבינות:** קראי את `SPEC.md` שבתיקיית המסך, את המשימה ב-Jira ואת הפריים ב-Figma. בהתנגשות, v1-lite קובע.
2. **ענף:** `feature/PEDB-12-S01-client` מתוך `dev`.
3. **קליינט (ספרינט 1):** החליפי את ה-placeholder ב-`src/screens/<מסך>/index.tsx`.
   - מבנה: כותרת, מצבי מסך, תוכן. השתמשי ב-`styles/recipes.ts` וב-`components/StateViews.tsx`.
   - נתוני הדמה: הוסיפי handlers ב-`src/mocks/handlers.ts` לפי החוזה ב-`openapi/openapi.yaml`, כדי שהמסך יעבוד בלי שרת.
4. **API:** צרי `src/api/<משאב>Api.ts` עם `apiSlice.injectEndpoints` (ראי `announcementsApi.ts`). אל תערכי את `apiSlice.ts` עצמו.
5. **הרשאות:** `usePermission('<מסך>')` ו-`canWrite(level)`. הסתירי פעולות שאין הרשאה אליהן.
6. **חיבור מקצה לקצה (ספרינט 4):** הוציאי את ה-handlers שלך מ-`mocks` שאינם נחוצים והריצי מול השרת האמיתי.
7. **בדיקות (ספרינט 5):** קובץ `*.test.tsx` ליד המסך. ראי `Announcements.test.tsx`: `renderWithProviders`, משתמש מחובר עם `token`, ובדיקת מצבי המסך.
8. **`npm run verify`** ופתיחת PR ל-`dev`.

## לשוניות

מסך עם לשוניות מנהל את הלשונית הפעילה ב-`?tab=` ב-URL (`useSearchParams`), כך שאפשר לקשר ישירות ללשונית וכפתור "חזרה" עובד. לכל לשונית יש פריים ב-Figma.

## כללים קצרים

- מצבי טעינה, ריק, שגיאה ואין הרשאה בכל מסך.
- טקסטים בעברית פשוטה ובלשון נקייה.
- אסור לשנות קבצים משותפים (`layout`, `routes`, `styles`, `components`, `apiSlice.ts`) בלי אישור ראשת צוות. צריכה רכיב או מתכון חדש? פתחי PR נפרד אליהם.
