# G04 · ניהול מבחנים ומטלות

**מפתחת:** A-08 (שני המסכים שלה: G04 ו-G08) · **מורכבות:** בינוני · **מודול:** ציונים והערכות
**צוות:** A · תלמידים וציונים (Jira 1)

## מטרה

יצירת מבחנים ומטלות לכיתה או קבוצה, והגדרת משקל וסוג.

**מי משתמש:** מורה, מחנך
**איך מגיעים:** מתפריט ציונים או מהמקצועות שלי.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** רשימת מבחנים ויצירה ועריכה.
**נדחה:** אין.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **כותרת** (bar): מבחנים ומטלות · יצירת חדש
- **רשימה** (table): שם · סוג · תאריך · משקל · ציונים הוזנו
- **יצירה** (form): שם * · כיתה / קבוצה * · מקצוע * · סוג * (מבחן, בוחן, מטלה) · תאריך · משקל %

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [Select](http://localhost:6006/?path=/story/components-select--playground) ◇
- [TextField](http://localhost:6006/?path=/story/components-textfield--playground) ◇
- [DatePicker](http://localhost:6006/?path=/story/components-datepicker--variants-and-states) ◇
- [Badge](http://localhost:6006/?path=/story/components-badge--playground) ◇
- [Modal](http://localhost:6006/?path=/story/components-modal--playground)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- יצירת מבחן יוצרת טבלת ציונים ריקה ב-G01.
- מחיקת מבחן עם ציונים דורשת אישור כפול.

## כללים ותנאים

- סכום המשקלים במחצית חייב להיות 100% לפני הפקת תעודה.
- אי אפשר ליצור מבחן לכיתה שאינה של המורה.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02).

## API

- `GET/POST /assessments`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** assessments
**נקראים:** classes, subjects, users

## קריטריוני קבלה

- [ ] מבחן חדש זמין להזנה מיד.
- [ ] התראה כשמשקלים לא מסתכמים ל-100.

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
