# I08 · חדרים ומשאבים

**מפתחת:** B-05 (שני המסכים שלה: I08 ו-T01) · **מורכבות:** קל · **מודול:** הגדרות
**צוות:** B · הגדרות ומערכת שעות (Jira 2)

## מטרה

רשימת החדרים והמשאבים שמערכת השעות משבצת אליהם.

**מי משתמש:** מנהל, רכז מערכת שעות
**איך מגיעים:** תפריט: הגדרות > חדרים.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** רשימת חדרים והוספה, עריכה והשבתה.
**נדחה:** אין.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **כותרת** (bar): חדרים ומשאבים · הוספת חדר
- **טבלת חדרים** (table): שם · סוג · קיבולת · זמינות · פעולות
- **חדר** (form): שם * · סוג (כיתה, מעבדה, אולם) · קיבולת · הערות

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [Select](http://localhost:6006/?path=/story/components-select--playground) ◇
- [TextField](http://localhost:6006/?path=/story/components-textfield--playground) ◇
- [TextArea](http://localhost:6006/?path=/story/components-textarea--playground)
- [Badge](http://localhost:6006/?path=/story/components-badge--playground) ◇
- [DropdownMenu](http://localhost:6006/?path=/story/components-dropdownmenu--closed)
- [IconButton](http://localhost:6006/?path=/story/components-iconbutton--playground) ◇
- [Alert](http://localhost:6006/?path=/story/components-alert--playground)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- חדר שיש בו שיעורים לא נמחק אלא מושבת אחרי העברת השיעורים.

## כללים ותנאים

- שם חדר ייחודי.
- קיבולת משמשת כהתראה בלבד, לא כחסימה.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02).

## API

- `GET/POST /rooms`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** rooms
**נקראים:** -

## קריטריוני קבלה

- [ ] חדר מושבת לא מופיע בבורר חדרים ב-T02.

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
