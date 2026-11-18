# I07 · יומן אירועים בית ספרי

**מפתחת:** B-04 (שני המסכים שלה: I07 ו-I01) · **מורכבות:** בינוני · **מודול:** הגדרות
**צוות:** B · הגדרות ומערכת שעות (Jira 2)

## מטרה

לוח שנה של חגים, אירועים, ימי הורים וחופשות, שמשפיע על נוכחות ושיבוץ.

**מי משתמש:** מנהל (עריכה), כולם (צפייה)
**איך מגיעים:** תפריט: הגדרות > יומן.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** רשימת אירועים והוספה, עריכה ומחיקה.
**נדחה:** תצוגת לוח חודשי; אירועים חוזרים.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **כותרת** (bar): יומן בית ספרי · מעבר חודש / שבוע · הוספת אירוע
- **תצוגת חודש** (grid): ימי השבוע · תאי ימים עם אירועים בצבע לפי סוג
- **אירוע** (form): כותרת * · סוג * (חג, אירוע, ימי הורים, חופשה) · תאריך התחלה וסיום * · חל על: כל המוסד / שכבות
- **מקרא סוגי אירועים** (list): צבע לכל סוג

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Select](http://localhost:6006/?path=/story/components-select--playground) ◇
- [TextField](http://localhost:6006/?path=/story/components-textfield--playground) ◇
- [Checkbox](http://localhost:6006/?path=/story/components-checkbox--playground) ◇
- [DatePicker](http://localhost:6006/?path=/story/components-datepicker--variants-and-states) ◇
- [Badge](http://localhost:6006/?path=/story/components-badge--playground) ◇
- [Card](http://localhost:6006/?path=/story/components-card--variants-and-states)
- [Modal](http://localhost:6006/?path=/story/components-modal--playground)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.
>
> לוח חודשי: אין רכיב משותף. בונים רשת מהטוקנים; לסטטוס יום משתמשים ב-AttendanceChip או ב-Badge.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- יום המסומן כחופשה אינו דורש סימון נוכחות.
- לחיצה על תא יום פותחת הוספה מהירה.

## כללים ותנאים

- אירוע שחל על שכבה מסוימת לא משפיע על האחרות.
- מחיקת אירוע חוזר מאפשרת 'רק זה' או 'כל הסדרה'.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02).

## API

- `GET /events?from=&to=`
- `POST /events`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** אין
**אוספים משותפים שהמסך אחראי על הכתיבה אליהם (המודל וה-seed באוספי הליבה):** events
**נקראים:** academic_years

## קריטריוני קבלה

- [ ] חופשה מבטלת דרישת נוכחות באותו יום.
- [ ] הצפייה זמינה לכל התפקידים.

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
