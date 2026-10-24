# school-client

הקליינט של מערכת הניהול הפדגוגית. React, TypeScript, Redux Toolkit (RTK Query), React Router ו-Tailwind. כל הממשק בעברית ומימין לשמאל.

## התחלה מהירה

```bash
npm install
cp .env.example .env
npm run dev                      # http://localhost:5173
```

**בלי שרת:** ב-`.env` הגדירי `VITE_USE_MOCKS=true`. הקליינט עובד על נתוני הדמה שב-`src/mocks`.
**עם שרת:** הפעילי את `school-server` על פורט 4000 (`npm run dev` שם). הקליינט מעביר אליו כל בקשה ל-`/api`.

משתמשי הדמה (סיסמה `Demo1234!`): הנהלה `yuval.mizrahi@school.example`, מזכירות `or.barak@school.example`, מחנכת `amit.cohen@school.example`, מורה `mor.dahan@school.example`, הורה `amit.biton@school.example`.

## פקודות

| פקודה                             | מה היא עושה                               |
| --------------------------------- | ----------------------------------------- |
| `npm run dev`                     | שרת פיתוח                                 |
| `npm run verify`                  | typecheck, lint ובדיקות. להריץ לפני כל PR |
| `npm test` / `npm run test:watch` | בדיקות (Vitest ו-Testing Library)         |
| `npm run build`                   | בניית ייצור ל-`dist`                      |
| `npm run storybook`               | קטלוג הרכיבים (http://localhost:6006)     |
| `npm run format`                  | עיצוב הקוד עם Prettier                    |

## איך הקליינט בנוי

```
src/
  main.tsx, App.tsx          נקודת כניסה ונתב
  app/                       ה-store של Redux וה-hooks
  api/                       apiSlice (בסיס משותף) ו-API של כל מסך בקובץ משלו
  features/auth/             התחברות, הגנת נתיבים והרשאות (usePermission)
  layout/                    מסגרת האפליקציה (X01): תפריט צד, סרגל עליון, תפריט משני
  components/ui/             ספריית הרכיבים: Button, TextField, Table, Modal ועוד, עם בדיקות ו-stories
  components/                מצבי מסך (X02) ואייקונים
  styles/                    theme.css (טוקנים) ו-recipes.ts (מחרוזות Tailwind מוכנות)
  routes/screens.ts          רישום כל המסכים (נוצר מהאפיון)
  screens/<מזהה>-<שם>/       תיקייה לכל מסך: index.tsx ו-SPEC.md
  mocks/                     נתוני הדמה (MSW) לעבודה בלי שרת ובבדיקות
```

**תיקייה לכל מסך.** כל מפתחת עובדת בתיקיית המסך שלה, ולכן אין התנגשויות מיזוג. הנתיב והמסגרת כבר מחוברים: מחליפות את `index.tsx` של ה-placeholder במסך האמיתי. הקובץ `SPEC.md` שבתיקייה מכיל את מפרט המסך: מטרה, היקף v1-lite, אזורים, כללים, API וקריטריוני קבלה.

## עיצוב

- בונות מסכים מהרכיבים ב-`src/components/ui`. הם בנויים על Radix (דיאלוגים, תפריטים, לשוניות ובחירה), עם הטוקנים של הפרויקט (`tailwind.config.cjs`), RTL ונגישות מובנים. את כולם, עם כל הווריאנטים והמצבים, רואים ב-Storybook (`npm run storybook`).
- המתכונים ב-`src/styles/recipes.ts` רק למקום שאין בו רכיב. חסר רכיב? PR נפרד ל-`components/ui`.
- צבעים, גופנים ומרווחים רק מהטוקנים. בלי ערכים שרירותיים כמו `bg-[#123456]`.
- RTL: מחלקות לוגיות (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`) ולא `ml`, `mr`, `left`, `right`.
- נגישות: תווית לכל שדה, מיקוד גלוי, סטטוס לא בצבע בלבד, ניווט מקלדת.

## הרשאות

אחרי ההתחברות הקליינט שואל את השרת `/auth/me` ומקבל מפה של מסך ורמת גישה (`full`, `scoped`, `read`). `usePermission('S01')` מחזיר את הרמה, ו-`canWrite(level)` אומר אם מותר לערוך. התפריט מוצג לפי ההרשאות. השרת הוא זה שאוכף: הקליינט רק מסתיר.

## מסך ההדרכה

`src/screens/_reference-announcements` הוא דוגמה מלאה (הודעות הנהלה, מסך שנדחה מגרסה 1): רשימה עם RTK Query, מצבי טעינה, ריק ושגיאה, טופס עם שגיאות שדה מהשרת, הרשאות, ובדיקות עם נתוני הדמה. השרת התואם: `school-server/src/modules/announcements`. הנתיב: `/reference/announcements`.

## מסמכים נוספים

- [docs/build-a-screen.md](docs/build-a-screen.md): צעד אחר צעד, איך בונים מסך
- [CONTRIBUTING.md](CONTRIBUTING.md): מחזור העבודה השבועי, ענפים, PR וקוד ריוויו
