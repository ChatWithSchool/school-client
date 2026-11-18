# N05 · אישורי איחור ויציאה מוקדמת

**מפתחת:** C-06 (שני המסכים שלה: N05 ו-X03) · **מורכבות:** בינוני · **מודול:** נוכחות
**צוות:** C · נוכחות, צוות וחשבון (Jira 3)

## מטרה

בקשה ואישור של היעדרות חלקית: איחור מאושר או יציאה מוקדמת.

**מי משתמש:** מחנך, מזכירות, מנהל (אישור)
**איך מגיעים:** מסך הנוכחות (N01) או תפריט נוכחות > אישורים.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** בקשה, אישור ודחייה של איחור או יציאה מוקדמת.
**נדחה:** אין.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## לשוניות

לכל לשונית יש פריים משלה ב-Figma. בקליינט מנהלים את הלשונית הפעילה ב-`?tab=` ב-URL: אושרו, נדחו (ולשונית ראשונה).

## אזורי המסך

- **לשוניות** (tabs): ממתינים · אושרו · נדחו
- **בקשה חדשה** (form): תלמיד * · סוג * (איחור, יציאה מוקדמת) · שעה * · סיבה · מי מאשר
- **בקשות** (table): תלמיד · סוג · שעה · מבקש · סטטוס · פעולה
- **פעולות** (actions): אשר · דחה עם הערה

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Tabs](http://localhost:6006/?path=/story/components-tabs--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [Select](http://localhost:6006/?path=/story/components-select--playground) ◇
- [TextField](http://localhost:6006/?path=/story/components-textfield--playground) ◇
- [TextArea](http://localhost:6006/?path=/story/components-textarea--playground)
- [Badge](http://localhost:6006/?path=/story/components-badge--playground) ◇
- [Avatar](http://localhost:6006/?path=/story/components-avatar--playground) ◇
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- אישור מעדכן את סטטוס הנוכחות ל'מאושר'.
- דחייה דורשת הערה.

## כללים ותנאים

- רק מנהל או מי שהוגדר לכך מאשר.
- בקשה מאושרת מופיעה בדוחות כנפרדת מהיעדרות רגילה.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02). בנוסף: ריק: 'אין בקשות ממתינות.'

## API

- `POST /attendance/exceptions`
- `PATCH /attendance/exceptions/{id}`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** attendance_exceptions
**נקראים:** attendance_records, students, users

## קריטריוני קבלה

- [ ] הסטטוס בדוח משתנה אחרי אישור.
- [ ] בקשה ממתינה מופיעה בדשבורד המנהל.

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
