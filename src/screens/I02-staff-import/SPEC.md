# I02 · ייבוא צוות הוראה מקובץ

**מפתחת:** C-03 (שני המסכים שלה: I02 ו-I04) · **מורכבות:** מורכב · **מודול:** צוות
**צוות:** C · נוכחות, צוות וחשבון (Jira 3)

## מטרה

העלאת קובץ של אנשי צוות, בדיקה וקליטה שלהם בבת אחת, עם דוח שגיאות ברור.

**מי משתמש:** מנהל
**איך מגיעים:** שלב 2 באשף I01, וגם מתוך רשימת הצוות (I04).

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** ייבוא CSV בלבד: העלאה, בדיקה, אישור ודוח שגיאות.
**נדחה:** קבצי Excel; עדכון שורות קיימות.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **שלבים** (steps): הורדת תבנית · העלאה · בדיקה · אישור
- **העלאת קובץ** (upload): גרירת קובץ או בחירה · פורמטים: Excel, CSV · קישור להורדת תבנית
- **תוצאות בדיקה** (table): שורה · שם · אימייל · סטטוס · שגיאה
- **פעולות** (actions): אשר ויבא שורות תקינות · הורד דוח שגיאות · ביטול

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [Badge](http://localhost:6006/?path=/story/components-badge--playground) ◇
- [Avatar](http://localhost:6006/?path=/story/components-avatar--playground) ◇
- [Stepper](http://localhost:6006/?path=/story/components-stepper--playground) ◇
- [FileDropzone](http://localhost:6006/?path=/story/components-filedropzone--playground)
- [Progress](http://localhost:6006/?path=/story/components-progress--playground)
- [IconButton](http://localhost:6006/?path=/story/components-iconbutton--playground) ◇
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- בשלב הבדיקה מוצגות שורות תקינות ושורות שגויות בנפרד.
- 'אשר ויבא' קולט רק את השורות התקינות.
- דוח השגיאות מורד כקובץ לתיקון והעלאה חוזרת.

## כללים ותנאים

- ולידציה: שם, אימייל תקין, אימייל ייחודי במוסד.
- אימייל קיים מוצג כעדכון ולא כשורה חדשה.
- הייבוא אטומי לכל שורה, שורה שגויה לא עוצרת את האחרות.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02).

## API

- `POST /staff/import/validate`
- `POST /staff/import/commit`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** אין
**נקראים:** staff_profiles, users

## קריטריוני קבלה

- [ ] קובץ עם שגיאות לא מפיל את הקליטה.
- [ ] מוצג סיכום: כמה נקלטו, כמה נדחו.
- [ ] מספר השורות המרבי מוצג למשתמש.

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
