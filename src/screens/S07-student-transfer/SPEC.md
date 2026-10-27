# S07 · העברת תלמיד בין כיתות

**מפתחת:** A-04 (שני המסכים שלה: S07 ו-S05) · **מורכבות:** קל · **מודול:** תלמידים וקבוצות
**צוות:** A · תלמידים וציונים (Jira 1)

## מטרה

חלון קצר להעברת תלמיד לכיתה אחרת, עם תאריך תחולה ושמירת היסטוריה.

**מי משתמש:** מנהל, מזכירות
**איך מגיעים:** מכרטיס התלמיד או מרשימת התלמידים.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** חלון העברה עם תאריך תחולה ושמירת היסטוריה.
**נדחה:** אין.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **פרטי ההעברה** (form): כיתה נוכחית (קריאה בלבד) · כיתה חדשה * · תאריך תחולה * · סיבה (אופציונלי)
- **השפעות** (note): מוצג: מה יקרה לנוכחות וציונים עד היום
- **פעולות** (actions): אשר העברה · בטל

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Select](http://localhost:6006/?path=/story/components-select--playground) ◇
- [TextField](http://localhost:6006/?path=/story/components-textfield--playground) ◇
- [DatePicker](http://localhost:6006/?path=/story/components-datepicker--variants-and-states) ◇
- [Alert](http://localhost:6006/?path=/story/components-alert--playground)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- נוכחות וציונים היסטוריים נשארים משויכים לכיתה הישנה בתקופתה.
- ההעברה נוספת להיסטוריית השיוכים בכרטיס.

## כללים ותנאים

- לא ניתן להעביר לכיתה בשכבה אחרת בלי אישור מפורש.
- תאריך תחולה לא יכול להיות לפני תחילת השנה.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02).

## API

- `POST /students/{id}/transfer`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** class_transfers
**נקראים:** students, classes

## קריטריוני קבלה

- [ ] אחרי העברה התלמיד מופיע בכיתה החדשה בלבד מהתאריך.
- [ ] ההיסטוריה גלויה למנהל.

## שלבי העבודה

| ספרינט | שלב                            |
| ------ | ------------------------------ |
| 1      | קליינט                         |
| 2      | סכמות ו-seed                   |
| 2      | סרבר א': חוזה ו-GET            |
| 3      | סרבר ב': כתיבה, הרשאות ושגיאות |
| 4      | חיבור מקצה לקצה                |
| 5      | בדיקות אוטומטיות               |

פריימי Figma של המסך מפורטים בתת-המשימה בג׳ירה.
