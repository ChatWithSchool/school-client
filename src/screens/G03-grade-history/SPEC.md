# G03 · היסטוריית שינויי ציון

**מפתחת:** A-06 (שני המסכים שלה: G03 ו-G01) · **מורכבות:** קל · **מודול:** ציונים והערכות
**צוות:** A · תלמידים וציונים (Jira 1)

## מטרה

מי שינה ציון, מתי ומה היה לפני, לצורכי שקיפות ובקרה.

**מי משתמש:** מנהל, מורה (שלו)
**איך מגיעים:** מקישור 'היסטוריה' ליד ציון ב-G01 או מלשונית הציונים.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** טבלת היסטוריה של ציון.
**נדחה:** אין.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **כותרת** (bar): היסטוריית ציון · תלמיד, מקצוע, מבחן
- **שינויים** (table): תאריך ושעה · מי שינה · ערך קודם · ערך חדש · סיבה

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [DatePicker](http://localhost:6006/?path=/story/components-datepicker--variants-and-states) ◇
- [Avatar](http://localhost:6006/?path=/story/components-avatar--playground) ◇
- [Modal](http://localhost:6006/?path=/story/components-modal--playground)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- שינוי לאחר פרסום תעודה דורש מילוי סיבה.

## כללים ותנאים

- ההיסטוריה לקריאה בלבד ואינה ניתנת למחיקה.
- מורה רואה רק שינויים בציונים שלו.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02).

## API

- `GET /grades/{id}/history`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** grade_history
**נקראים:** grades, users

## קריטריוני קבלה

- [ ] כל שינוי מתועד עם כותב.
- [ ] ההיסטוריה זמינה גם אחרי מחיקה רכה.

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
