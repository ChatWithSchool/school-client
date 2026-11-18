# N04 · התראות היעדרות ויומן הודעות להורים

**מפתחת:** C-05 (שני המסכים שלה: N04 ו-N06) · **מורכבות:** בינוני · **מודול:** נוכחות
**צוות:** C · נוכחות, צוות וחשבון (Jira 3)

## מטרה

חוקים פשוטים שמסמנים היעדרות חוזרת או דפוס קבוע, ויומן של ההודעות שנשלחו להורים (מדומה בגרסה 1).

**מי משתמש:** מנהל, מחנך
**איך מגיעים:** התראה בדשבורד או תפריט נוכחות > התראות.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** התראות פתוחות, חוקי סף ויומן הודעות מדומה.
**נדחה:** זיהוי דפוס שבועי.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## לשוניות

לכל לשונית יש פריים משלה ב-Figma. בקליינט מנהלים את הלשונית הפעילה ב-`?tab=` ב-URL: חוקי סף, יומן הודעות להורים (ולשונית ראשונה).

## אזורי המסך

- **לשוניות** (tabs): התראות פתוחות · חוקי סף · יומן הודעות להורים
- **התראות** (table): תלמיד · סוג (רצף, דפוס שבועי) · מאז · סטטוס · פעולה
- **חוקי סף** (form): מספר ימי היעדרות ברצף · מספר היעדרויות בחודש · זיהוי דפוס: יום קבוע בשבוע · שליחת הודעה להורים אוטומטית
- **יומן הודעות** (table): תאריך · תלמיד · תוכן · סטטוס שליחה

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Tabs](http://localhost:6006/?path=/story/components-tabs--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [TextField](http://localhost:6006/?path=/story/components-textfield--playground) ◇
- [TextArea](http://localhost:6006/?path=/story/components-textarea--playground)
- [DatePicker](http://localhost:6006/?path=/story/components-datepicker--variants-and-states) ◇
- [Badge](http://localhost:6006/?path=/story/components-badge--playground) ◇
- [Avatar](http://localhost:6006/?path=/story/components-avatar--playground) ◇
- [Alert](http://localhost:6006/?path=/story/components-alert--playground)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- טיפול בהתראה מסמן אותה כנסגרת עם הערה.
- בגרסה 1 'שליחה' נרשמת ביומן בלבד, בלי שירות חיצוני.

## כללים ותנאים

- זיהוי הדפוסים מבוסס כללים ולא על AI.
- התראה לא נוצרת פעמיים לאותו מקרה.
- תוכן ההודעה להורה נבנה מתבנית שהמנהל מאשר.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02).

## API

- `GET /attendance/alerts`
- `PUT /attendance/rules`
- `GET /notifications/log`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** attendance_rules, notification_log
**אוספים משותפים שהמסך אחראי על הכתיבה אליהם (המודל וה-seed באוספי הליבה):** attendance_alerts
**נקראים:** attendance_records, students

## קריטריוני קבלה

- [ ] שינוי החוקים משפיע על התראות עתידיות בלבד.
- [ ] היומן מציג בבירור שמדובר בשליחה מדומה.

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
