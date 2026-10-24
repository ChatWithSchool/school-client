# G05 · סטטיסטיקות והשוואות

**מפתחת:** A-07 (שני המסכים שלה: G05 ו-G02) · **מורכבות:** בינוני · **מודול:** ציונים והערכות
**צוות:** A · תלמידים וציונים (Jira 1)

## מטרה

ממוצע, חציון ופיזור ציונים למבחן, והשוואה בין כיתות או מקצועות.

**מי משתמש:** מורה, מחנך, מנהל
**איך מגיעים:** מכפתור 'נתונים' ב-G01 או מתפריט ציונים > ניתוח.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** ממוצע, חציון וטבלת השוואה בין כיתות.
**נדחה:** היסטוגרמה.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **סינון** (filters): מבחן / מקצוע · כיתות להשוואה · מחצית
- **מדדים** (cards): ממוצע · חציון · סטיית תקן
- **התפלגות** (chart): היסטוגרמה: טווחי ציונים
- **השוואה** (table): כיתה · ממוצע · חציון · מספר תלמידים

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [Select](http://localhost:6006/?path=/story/components-select--playground) ◇
- [MetricCard](http://localhost:6006/?path=/story/components-metriccard--playground) ◇
- [Card](http://localhost:6006/?path=/story/components-card--variants-and-states)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.
>
> גרף: אין רכיב משותף. בונים לפי מדריך העיצוב, בצבעי `chart-c1`–`chart-c6`, ועם תווית ישירה על הנתונים.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- בחירת כמה כיתות מציגה אותן זו לצד זו.
- הצגה אנונימית של התפלגות: לא נראים שמות.

## כללים ותנאים

- מורה משווה רק כיתות שהוא מלמד.
- נתונים של פחות מ-5 תלמידים מסומנים כלא מייצגים.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02).

## API

- `GET /assessments/{id}/stats`
- `GET /stats/compare`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** אין
**נקראים:** assessments, grades, classes

## קריטריוני קבלה

- [ ] החישובים תואמים לתוצאות ב-G01.
- [ ] הגרף נגיש בטבלה חלופית.

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
