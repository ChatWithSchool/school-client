# S04 · כיתות וקבוצות לימוד

**מפתחת:** A-03 (שני המסכים שלה: S04 ו-S10) · **מורכבות:** בינוני · **מודול:** תלמידים וקבוצות
**צוות:** A · תלמידים וציונים (Jira 1)

## מטרה

ניהול כיתות וקבוצות, כולל קבוצות חוצות-כיתה (רמות) וקבוצות ייעודיות (חוגים), ושיוך תלמידים.

**מי משתמש:** מנהל, רכז, מחנך (צפייה בכיתתו)
**איך מגיעים:** תפריט: כיתות וקבוצות.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** כיתות וקבוצות לימוד: רשימה, יצירה ושיוך תלמידים.
**נדחה:** קבוצות ייעודיות (חוגים).

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## לשוניות

לכל לשונית יש פריים משלה ב-Figma. בקליינט מנהלים את הלשונית הפעילה ב-`?tab=` ב-URL: קבוצות לימוד (ולשונית ראשונה).

## אזורי המסך

- **כותרת** (bar): כיתות וקבוצות · הוספת קבוצה
- **לשוניות** (tabs): כיתות · קבוצות לימוד · קבוצות ייעודיות
- **רשימה** (table): שם · שכבה · מחנך · מספר תלמידים
- **שיוך תלמידים** (list): רשימת חברים · הוספה בחיפוש · הסרה

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Tabs](http://localhost:6006/?path=/story/components-tabs--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [SearchField](http://localhost:6006/?path=/story/components-searchfield--playground) ◇
- [Badge](http://localhost:6006/?path=/story/components-badge--playground) ◇
- [Avatar](http://localhost:6006/?path=/story/components-avatar--playground) ◇
- [Card](http://localhost:6006/?path=/story/components-card--variants-and-states)
- [Modal](http://localhost:6006/?path=/story/components-modal--playground)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- הוספת תלמיד לקבוצה נעשית בחיפוש עם השלמה אוטומטית.
- תלמיד יכול להשתייך לכמה קבוצות אך לכיתה אחת בלבד.

## כללים ותנאים

- מחיקת קבוצה מסירה שיוכים בלבד ואינה מוחקת תלמידים.
- מחנך אחד לכיתה.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02).

## API

- `GET/POST /classes`
- `GET/POST /groups`
- `PUT /groups/{id}/members`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** groups, group_members
**נקראים:** classes, students

## קריטריוני קבלה

- [ ] קבוצה חוצת-כיתה מציגה את הכיתה של כל חבר.
- [ ] מספר התלמידים מתעדכן מיד.

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
