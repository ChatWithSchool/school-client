# T04 · ייבוא וייצוא מערכת שעות

**מפתחת:** B-07 (שני המסכים שלה: T04 ו-I06) · **מורכבות:** בינוני · **מודול:** מערכת שעות
**צוות:** B · הגדרות ומערכת שעות (Jira 2)

## מטרה

ייצוא מערכת השעות לקובץ Excel לפי תבנית וייבוא חזרה אחרי עריכה, עם בדיקות.

**מי משתמש:** מנהל
**איך מגיעים:** מ-T01 או מ-T02: תפריט נוסף.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** ייצוא CSV של מערכת השעות.
**נדחה:** ייבוא מקובץ.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **פעולות** (actions): הורדת תבנית · ייצוא נוכחית · ייבוא מקובץ
- **העלאה** (upload): גרירת קובץ · Excel בלבד
- **תוצאות בדיקה** (table): שורה · שיעור · סטטוס · שגיאה / התנגשות
- **אישור** (actions): יבא תקינות · ביטול

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [Badge](http://localhost:6006/?path=/story/components-badge--playground) ◇
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

- הבדיקה מציגה גם התנגשויות, לא רק שגיאות פורמט.
- הייבוא יוצר טיוטה ולא מפרסם.

## כללים ותנאים

- תבנית נוספת לא מקובלת.
- ייבוא לא מוחק מערכת קיימת בלי אישור מפורש.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02).

## API

- `GET /schedule/template`
- `POST /schedule/import/validate`
- `POST /schedule/import/commit`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** אין
**נקראים:** lessons

## קריטריוני קבלה

- [ ] הייבוא מייצר טיוטה לבדיקה.
- [ ] קובץ עם התנגשויות מציג אותן.

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
