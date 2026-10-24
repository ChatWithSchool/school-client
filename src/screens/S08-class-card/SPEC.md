# S08 · כרטיס כיתה מרוכז

**מפתחת:** A-05 (שני המסכים שלה: S08 ו-S09) · **מורכבות:** בינוני · **מודול:** תלמידים וקבוצות
**צוות:** A · תלמידים וציונים (Jira 1)

## מטרה

תמונת מצב של כיתה אחת: מי בה, איך הנוכחות, איך הציונים, ומה פתוח.

**מי משתמש:** מנהל, מחנך
**איך מגיעים:** מ-S04 או מהדשבורד.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** כותרת, מדדים וטבלת תלמידי הכיתה.
**נדחה:** קיצורי פעולה.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **כותרת** (bar): שם הכיתה · מחנך · מספר תלמידים
- **מדדים** (cards): נוכחות החודש · ממוצע ציונים · תלמידים עם התראה
- **תלמידי הכיתה** (table): שם · נוכחות · ממוצע · תגיות
- **פעולות** (actions): סימון נוכחות · הזנת ציונים · מערכת שעות הכיתה

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [Checkbox](http://localhost:6006/?path=/story/components-checkbox--playground) ◇
- [Badge](http://localhost:6006/?path=/story/components-badge--playground) ◇
- [Avatar](http://localhost:6006/?path=/story/components-avatar--playground) ◇
- [Tag](http://localhost:6006/?path=/story/components-tag--playground)
- [MetricCard](http://localhost:6006/?path=/story/components-metriccard--playground) ◇
- [Card](http://localhost:6006/?path=/story/components-card--variants-and-states)
- [Alert](http://localhost:6006/?path=/story/components-alert--playground)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- לחיצה על תלמיד פותחת את כרטיסו.
- הפעולות מעבירות למסך הרלוונטי כשהכיתה כבר נבחרת.

## כללים ותנאים

- מורה מקצועי רואה רק את המקצוע שלו.
- המדדים מחושבים לתקופה הנוכחית.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02).

## API

- `GET /classes/{id}/overview`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** אין
**נקראים:** classes, students, attendance_records, grades

## קריטריוני קבלה

- [ ] המדדים תואמים לדוחות הנוכחות והציונים.
- [ ] מעבר לפעולה שומר את הקשר הכיתה.

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
