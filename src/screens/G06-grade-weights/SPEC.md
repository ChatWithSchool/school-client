# G06 · משקלים לציון סופי

**מפתחת:** A-09 (שני המסכים שלה: G06 ו-G07) · **מורכבות:** בינוני · **מודול:** ציונים והערכות
**צוות:** A · תלמידים וציונים (Jira 1)

## מטרה

הגדרת האופן שבו ציונים מצטברים לציון מחצית וסופי: משקל לכל סוג הערכה.

**מי משתמש:** מנהל, רכז
**איך מגיעים:** תפריט: ציונים > משקלים.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** טבלת משקלים עם סכום 100%.
**נדחה:** העתקה משכבה אחרת.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **בחירה** (filters): שכבה · מקצוע · מחצית
- **משקלים** (table): סוג הערכה · משקל %
- **סיכום** (note): סה"כ 100%
- **פעולות** (actions): שמור · העתק משכבה אחרת

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [Select](http://localhost:6006/?path=/story/components-select--playground) ◇
- [Alert](http://localhost:6006/?path=/story/components-alert--playground)
- [Toast](http://localhost:6006/?path=/story/components-toast--playground)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- שינוי משקלים מחשב מחדש ציונים של המחצית הפתוחה.
- מחצית סגורה אינה משתנה.

## כללים ותנאים

- הסכום חייב להיות 100% לפני שמירה.
- שינוי משקל אחרי הפקת תעודה דורש אישור והסבר.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02).

## API

- `GET/PUT /grading/weights`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** grading_weights
**נקראים:** subjects, classes

## קריטריוני קבלה

- [ ] חישוב הציון הסופי תואם לטבלת המשקלים.
- [ ] מחצית סגורה נעולה.

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
