# איך בונים מסך

1. **מבינות:** קראי את `SPEC.md` שבתיקיית המסך, את המשימה ב-Jira ואת הפריים ב-Figma. בהתנגשות, v1-lite קובע.
2. **ענף:** `feature/PEDB-12-S01-client` מתוך `dev`.
3. **קליינט (ספרינט 1):** החליפי את ה-placeholder ב-`src/screens/<מסך>/index.tsx`.
   - מבנה: כותרת (`PageHeader`), מצבי מסך, תוכן. בונות מהרכיבים של `components/ui`: `import { Button, TextField, Table } from '../../components/ui'`. מצבי המסך ב-`components/StateViews.tsx`.
   - כל הרכיבים, עם כל הווריאנטים והמצבים שלהם, מוצגים ב-Storybook: `npm run storybook` (http://localhost:6006). שמות הרכיבים והמאפיינים זהים לספריית הרכיבים ב-Figma.
   - `styles/recipes.ts` רק למקום שאין בו רכיב מתאים.
   - נתוני הדמה: הוסיפי handlers ב-`src/mocks/handlers.ts` לפי החוזה ב-`openapi/openapi.yaml`, כדי שהמסך יעבוד בלי שרת.
4. **API:** צרי `src/api/<משאב>Api.ts` עם `apiSlice.injectEndpoints` (ראי `announcementsApi.ts`). אל תערכי את `apiSlice.ts` עצמו.
5. **הרשאות:** `usePermission('<מסך>')` ו-`canWrite(level)`. הסתירי פעולות שאין הרשאה אליהן.
6. **חיבור מקצה לקצה (ספרינט 4):** הוציאי את ה-handlers שלך מ-`mocks` שאינם נחוצים והריצי מול השרת האמיתי.
7. **בדיקות (ספרינט 5):** קובץ `*.test.tsx` ליד המסך. ראי `Announcements.test.tsx`: `renderWithProviders`, משתמש מחובר עם `token`, ובדיקת מצבי המסך.
8. **`npm run verify`** ופתיחת PR ל-`dev`.

## לשוניות

מסך עם לשוניות משתמש ברכיב `Tabs` מ-`components/ui`. בתוך נתיב הוא שומר את הלשונית הפעילה ב-`?tab=` ב-URL (`useSearchParams`), כך שאפשר לקשר ישירות ללשונית וכפתור "חזרה" עובד. לכל לשונית יש פריים ב-Figma.

## כללים קצרים

- מצבי טעינה, ריק, שגיאה ואין הרשאה בכל מסך.
- טקסטים בעברית פשוטה ובלשון נקייה.
- רק רכיבים מ-`components/ui`, ובלי ערכים שרירותיים (`bg-[#123456]`, `w-[372px]`). כלל ה-lint חוסם אותם.
- אסור לשנות קבצים משותפים (`layout`, `routes`, `styles`, `components`, `apiSlice.ts`) בלי אישור ראשת צוות.
- חסר רכיב, או חסר לו ווריאנט? לא בונות אותו בתוך המסך. פותחות PR נפרד ל-`components/ui` (רכיב, בדיקה ו-story), ורק אחריו ממשיכות במסך.
