# S05 · ייבוא תלמידים מקובץ

**מפתחת:** A-04 (שני המסכים שלה: S05 ו-S07) · **מורכבות:** מורכב · **מודול:** תלמידים וקבוצות
**צוות:** A · תלמידים וציונים (Jira 1)

## מטרה

קליטה המונית של תלמידים עם דוח בדיקה לפני אישור.

**מי משתמש:** מנהל, מזכירות
**איך מגיעים:** מ-S01 (ייבוא מקובץ) ומשלב 3 באשף.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** ייבוא תלמידים מ-CSV: בדיקה, אישור ודוח שגיאות.
**נדחה:** יצירת כיתה חדשה מתוך הייבוא.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **שלבים** (steps): תבנית · העלאה · בדיקה · אישור
- **העלאה** (upload): גרירת קובץ · Excel / CSV · הורדת תבנית
- **בדיקה** (table): שורה · שם · כיתה · סטטוס · שגיאה
- **פעולות** (actions): יבא תקינות · הורד דוח שגיאות · ביטול

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [Badge](http://localhost:6006/?path=/story/components-badge--playground) ◇
- [Avatar](http://localhost:6006/?path=/story/components-avatar--playground) ◇
- [Stepper](http://localhost:6006/?path=/story/components-stepper--playground) ◇
- [FileDropzone](http://localhost:6006/?path=/story/components-filedropzone--playground)
- [Progress](http://localhost:6006/?path=/story/components-progress--playground)
- [IconButton](http://localhost:6006/?path=/story/components-iconbutton--playground) ◇
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- שורת כיתה שלא קיימת מוצעת ליצירה או לדילוג.
- מוצג מראש כמה שורות יתווספו וכמה יעודכנו.

## כללים ותנאים

- כפילות של תעודת זהות מסומנת כעדכון.
- אין חשיפת נתוני תלמיד בדוח השגיאות מעבר לשורה.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02).

## API

- `POST /students/import/validate`
- `POST /students/import/commit`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** import_jobs
**נקראים:** students, classes

## קריטריוני קבלה

- [ ] קובץ גדול מעובד בלי לחסום את הדפדפן.
- [ ] סיכום סופי: נוספו, עודכנו, נדחו.

## שלבי העבודה

| ספרינט | שלב                            |
| ------ | ------------------------------ |
| 1      | קליינט                         |
| 1      | סכמות ו-seed                   |
| 2      | סרבר א': חוזה ו-GET            |
| 3      | סרבר ב': כתיבה, הרשאות ושגיאות |
| 4      | חיבור מקצה לקצה                |
| 5      | בדיקות אוטומטיות               |

פריימי Figma של המסך מפורטים בתת-המשימה בג׳ירה.
