# S02 · טופס תלמיד (הוספה ועריכה)

**מפתחת:** A-01 (שני המסכים שלה: S02 ו-S01) · **מורכבות:** בינוני · **מודול:** תלמידים וקבוצות
**צוות:** A · תלמידים וציונים (Jira 1)

## מטרה

יצירה ועריכה של תלמיד, עם בדיקת כפילויות בזמן ההקלדה.

**מי משתמש:** מנהל, מזכירות
**איך מגיעים:** מ-S01 (תלמיד חדש) או מכפתור עריכה בכרטיס.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** טופס הוספה ועריכה עם בדיקת כפילות.
**נדחה:** 'שמור והוסף עוד'.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **כותרת** (bar): תלמיד חדש / עריכת תלמיד
- **פרטים אישיים** (form): שם פרטי * · שם משפחה * · תעודת זהות * · תאריך לידה * · כיתה *
- **קשר** (form): טלפון ראשי * · טלפון נוסף · אימייל הורה · כתובת
- **נוסף** (form): הערות כלליות · תגיות
- **פעולות** (actions): שמור · שמור והוסף עוד · בטל

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Select](http://localhost:6006/?path=/story/components-select--playground) ◇
- [TextField](http://localhost:6006/?path=/story/components-textfield--playground) ◇
- [TextArea](http://localhost:6006/?path=/story/components-textarea--playground)
- [DatePicker](http://localhost:6006/?path=/story/components-datepicker--variants-and-states) ◇
- [Tag](http://localhost:6006/?path=/story/components-tag--playground)
- [Toast](http://localhost:6006/?path=/story/components-toast--playground)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- בדיקת כפילות של תעודת זהות ואימייל מתבצעת כשיוצאים מהשדה.
- 'שמור והוסף עוד' מנקה את הטופס ושומר על הכיתה שנבחרה.
- יציאה עם שינויים שלא נשמרו מבקשת אישור.

## כללים ותנאים

- תעודת זהות תקינה לפי אלגוריתם בדיקה ישראלי ויחידה במוסד.
- אימייל ופורמט טלפון נבדקים.
- תלמיד כפול מוצג עם קישור לכרטיס הקיים.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02).

## API

- `POST /students`
- `PUT /students/{id}`
- `GET /students/check-duplicate`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** אין
**נקראים:** students, classes

## קריטריוני קבלה

- [ ] כפילות נתפסת לפני שליחה.
- [ ] הודעות שגיאה ליד כל שדה.
- [ ] הטופס שמיש במובייל.

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
