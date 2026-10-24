# I05 · פרופיל מורה

**מפתחת:** B-06 (שני המסכים שלה: I05 ו-T02) · **מורכבות:** קל · **מודול:** צוות
**צוות:** B · הגדרות ומערכת שעות (Jira 2)

## מטרה

כרטיס אחד לכל איש צוות: פרטים, מקצועות וכיתות שהוא מלמד, ומערכת השעות שלו.

**מי משתמש:** מנהל, המורה עצמו
**איך מגיעים:** מרשימת הצוות (I04) או מחיפוש גלובלי.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** פרופיל: פרטים ורשימת מקצועות וכיתות.
**נדחה:** לשוניות מערכת שעות ועומס.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## לשוניות

לכל לשונית יש פריים משלה ב-Figma. בקליינט מנהלים את הלשונית הפעילה ב-`?tab=` ב-URL: מקצועות וכיתות (ולשונית ראשונה).

## אזורי המסך

- **כותרת** (bar): שם איש הצוות · תפקיד וסטטוס · כפתור עריכה
- **לשוניות** (tabs): פרטים · מקצועות וכיתות · מערכת שעות · עומס הוראה
- **פרטים** (form): שם מלא · אימייל · טלפון · תאריך תחילת עבודה
- **מקצועות וכיתות** (table): מקצוע · כיתה · שעות בשבוע

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Tabs](http://localhost:6006/?path=/story/components-tabs--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [TextField](http://localhost:6006/?path=/story/components-textfield--playground) ◇
- [DatePicker](http://localhost:6006/?path=/story/components-datepicker--variants-and-states) ◇
- [Badge](http://localhost:6006/?path=/story/components-badge--playground) ◇
- [IconButton](http://localhost:6006/?path=/story/components-iconbutton--playground) ◇
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- שינוי השיוך נעשה במסך I06 ולא ישירות בכרטיס.
- לשונית מערכת השעות מציגה את T01 מסונן למורה.

## כללים ותנאים

- מורה רואה את הכרטיס שלו ועורך רק טלפון ופרטים אישיים.
- צפיית מנהל מלאה.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02).

## API

- `GET /staff/{id}`
- `PATCH /staff/{id}`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** אין
**נקראים:** staff_profiles, teaching_assignments, subjects, classes

## קריטריוני קבלה

- [ ] מורה לא רואה כרטיסי עמיתים.
- [ ] הכיתות במסך תואמות לשיוך שנקבע ב-I06.

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
