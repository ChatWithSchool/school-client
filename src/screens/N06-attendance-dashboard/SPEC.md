# N06 · דשבורד נוכחות מוסדי

**מפתחת:** C-05 (שני המסכים שלה: N06 ו-N04) · **מורכבות:** בינוני · **מודול:** נוכחות
**צוות:** C · נוכחות, צוות וחשבון (Jira 3)

## מטרה

תמונת הנוכחות של בית הספר כולו, עם מגמות וחתכים לפי שכבה וכיתה.

**מי משתמש:** מנהל, הנהלה
**איך מגיעים:** תפריט: נוכחות > מוסדי; כרטיס בדשבורד.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** מדדים וחתך כיתות.
**נדחה:** גרף מגמה וייצוא.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **מדדים** (cards): נוכחות היום · נוכחות החודש · תלמידים עם התראה
- **מגמה** (chart): קו: נוכחות יומית · סינון לפי שכבה
- **חתך כיתות** (table): כיתה · נוכחות · מגמה מול חודש קודם
- **ייצוא** (actions): PDF · Excel

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [AttendanceChip](http://localhost:6006/?path=/story/components-attendancechip--playground) ◇
- [MetricCard](http://localhost:6006/?path=/story/components-metriccard--playground) ◇
- [Card](http://localhost:6006/?path=/story/components-card--variants-and-states)
- [Alert](http://localhost:6006/?path=/story/components-alert--playground)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.
>
> גרף: אין רכיב משותף. בונים לפי מדריך העיצוב, בצבעי `chart-c1`–`chart-c6`, ועם תווית ישירה על הנתונים.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- לחיצה על כיתה בחתך פותחת את N03 עליה.
- בורר טווח תאריכים משנה את כל המסך יחד.

## כללים ותנאים

- הנתונים מתעדכנים בזמן אמת מנוכחות שסומנה.
- כיתה שלא סומנה היום מוצגת במפורש כ'לא דווח'.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02).

## API

- `GET /attendance/institution?from=&to=`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** אין
**נקראים:** attendance_records, attendance_alerts, classes

## קריטריוני קבלה

- [ ] כיתות שלא דווחו מופיעות ברשימה נפרדת.
- [ ] המדדים תואמים ל-N03.

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
