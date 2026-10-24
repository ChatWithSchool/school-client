# S06 · הערות התנהגות

**מפתחת:** A-02 (שני המסכים שלה: S06 ו-S03) · **מורכבות:** קל · **מודול:** תלמידים וקבוצות
**צוות:** A · תלמידים וציונים (Jira 1)

## מטרה

תיעוד אירוע או הערה על תלמיד, עם סוג, חומרה ומי רשאי לראות.

**מי משתמש:** מחנך, מורה, הנהלה
**איך מגיעים:** מלשונית ההערות בכרטיס התלמיד (S03).

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** רשימת הערות והוספת הערה.
**נדחה:** שליטה בנראות להורה לכל הערה.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **כותרת** (bar): הערות התנהגות · הוספת הערה
- **רשימה** (table): תאריך · סוג · חומרה · נכתב ע"י · נראה להורה
- **הערה חדשה** (form): סוג * (חיובי, משמעת, אחר) · חומרה · תיאור * · נראה להורה

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [Select](http://localhost:6006/?path=/story/components-select--playground) ◇
- [TextField](http://localhost:6006/?path=/story/components-textfield--playground) ◇
- [TextArea](http://localhost:6006/?path=/story/components-textarea--playground)
- [Checkbox](http://localhost:6006/?path=/story/components-checkbox--playground) ◇
- [DatePicker](http://localhost:6006/?path=/story/components-datepicker--variants-and-states) ◇
- [Badge](http://localhost:6006/?path=/story/components-badge--playground) ◇
- [Avatar](http://localhost:6006/?path=/story/components-avatar--playground) ◇
- [Modal](http://localhost:6006/?path=/story/components-modal--playground)
- [Toast](http://localhost:6006/?path=/story/components-toast--playground)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- הערה חיובית ומשמעתית מוצגות בצורה שונה.
- שינוי נראות להורה נרשם.

## כללים ותנאים

- רק הכותב וההנהלה עורכים; מחיקה רכה עם סיבה.
- הורה רואה רק הערות שסומנו לכך.
- הערה רגישה לא נשלחת במייל.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02).

## API

- `GET/POST /students/{id}/notes`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** student_notes
**נקראים:** students, users

## קריטריוני קבלה

- [ ] הערה מוסתרת לא מופיעה באפליקציית ההורה.
- [ ] כל הערה נושאת כותב ותאריך.

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
