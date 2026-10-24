# N02 · היסטוריית נוכחות של תלמיד

**מפתחת:** C-04 (שני המסכים שלה: N02 ו-N01) · **מורכבות:** קל · **מודול:** נוכחות
**צוות:** C · נוכחות, צוות וחשבון (Jira 3)

## מטרה

צפייה בנוכחות של תלמיד לאורך זמן, בצורה שהורה מבין בלי הסברים.

**מי משתמש:** מחנך, מנהל, הורה, תלמיד
**איך מגיעים:** מכרטיס תלמיד, או מאפליקציית ההורה.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** סיכום ורשימת פירוט לתקופה.
**נדחה:** לוח חודשי צבעוני.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **כותרת** (bar): נוכחות: [שם] · בורר תקופה
- **סיכום** (cards): אחוז נוכחות · ימי היעדרות · איחורים
- **לוח חודשי** (grid): כל יום בצבע לפי סטטוס
- **פירוט** (table): תאריך · שיעור · סטטוס · הערה

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [DatePicker](http://localhost:6006/?path=/story/components-datepicker--variants-and-states) ◇
- [Badge](http://localhost:6006/?path=/story/components-badge--playground) ◇
- [AttendanceChip](http://localhost:6006/?path=/story/components-attendancechip--playground) ◇
- [MetricCard](http://localhost:6006/?path=/story/components-metriccard--playground) ◇
- [Card](http://localhost:6006/?path=/story/components-card--variants-and-states)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.
>
> לוח חודשי: אין רכיב משותף. בונים רשת מהטוקנים; לסטטוס יום משתמשים ב-AttendanceChip או ב-Badge.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- לחיצה על יום מציג את פירוט השיעורים שלו.
- בורר התקופה: החודש, המחצית, השנה.

## כללים ותנאים

- הורה רואה רק ילדים מקושרים ולפי הגדרות הנראות.
- הלוח חייב סימן נוסף לצבע (לא רק צבע).

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02).

## API

- `GET /students/{id}/attendance?from=&to=`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** אין
**נקראים:** attendance_records, students

## קריטריוני קבלה

- [ ] האחוזים תואמים לדוח הכיתתי.
- [ ] הלוח נגיש לעיוורי צבעים.

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
