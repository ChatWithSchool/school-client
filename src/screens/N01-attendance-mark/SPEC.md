# N01 · סימון נוכחות יומי

**מפתחת:** C-04 (שני המסכים שלה: N01 ו-N02) · **מורכבות:** מורכב · **מודול:** נוכחות
**צוות:** C · נוכחות, צוות וחשבון (Jira 3)

## מטרה

המסך שבו מורה מסמן נוכחות לכיתה בדקה. מהירות ופשטות חשובות יותר מכל פיצ'ר אחר.

**מי משתמש:** מורה, מחנך
**איך מגיעים:** מ'היום שלי' (T06), מכרטיס כיתה או מתפריט נוכחות.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** סימון נוכחות לכיתה, שמירה אוטומטית וכפתור 'כולם נוכחים'.
**נדחה:** הערה לכל תלמיד.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **כותרת** (bar): נוכחות · בורר כיתה ושיעור · תאריך (ברירת מחדל: היום)
- **סרגל מהיר** (note): סמן את כולם נוכחים · מונה: נוכחים / נעדרים / איחורים
- **רשימת תלמידים** (table): שם · סטטוס: נוכח / נעדר / איחור · הערה
- **תחתית** (note): נשמר אוטומטית ב-HH:MM

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [Select](http://localhost:6006/?path=/story/components-select--playground) ◇
- [TextField](http://localhost:6006/?path=/story/components-textfield--playground) ◇
- [DatePicker](http://localhost:6006/?path=/story/components-datepicker--variants-and-states) ◇
- [Badge](http://localhost:6006/?path=/story/components-badge--playground) ◇
- [AttendanceToggle](http://localhost:6006/?path=/story/components-attendancetoggle--playground) ◇
- [Avatar](http://localhost:6006/?path=/story/components-avatar--playground) ◇
- [MetricCard](http://localhost:6006/?path=/story/components-metriccard--playground) ◇
- [Alert](http://localhost:6006/?path=/story/components-alert--playground)
- [Toast](http://localhost:6006/?path=/story/components-toast--playground)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- 'סמן את כולם נוכחים' מגדיר ברירת מחדל והמורה משנה רק חריגים.
- שמירה אוטומטית אחרי כל שינוי, עם חיווי שקט.
- לחיצה על סטטוס מחליפה במחזור: נוכח, נעדר, איחור.

## כללים ותנאים

- אי אפשר לסמן בתאריך עתידי.
- יום חופשה מציג הודעה במקום הרשימה.
- שינוי בנוכחות של יום קודם נרשם עם שם העורך.
- מורה מסמן רק כיתות ושיעורים שלו.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02). בנוסף: שגיאת שמירה: סרגל מתמיד 'לא נשמר, נסי שוב'

## API

- `GET /attendance?class=&date=&slot=`
- `PUT /attendance/bulk`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** attendance_records
**נקראים:** students, classes, lessons

## קריטריוני קבלה

- [ ] כיתה של 30 תלמידים מסומנת בפחות מדקה.
- [ ] כשל רשת לא מאבד שינויים ומציג אפשרות לנסות שוב.
- [ ] הרשימה נגישה בעבודה במובייל באגודל אחד.

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
