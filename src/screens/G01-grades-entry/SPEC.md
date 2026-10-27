# G01 · הזנת ציונים ומשוב

**מפתחת:** A-06 (שני המסכים שלה: G01 ו-G03) · **מורכבות:** מורכב · **מודול:** ציונים והערכות
**צוות:** A · תלמידים וציונים (Jira 1)

## מטרה

טבלה אחת לכיתה ולמבחן: מזינים ציון ומשוב מילולי לכל תלמיד, מהר ובלי לאבד נתונים.

**מי משתמש:** מורה, מחנך
**איך מגיעים:** מ'המקצועות שלי' (G08), מכרטיס כיתה או מתפריט ציונים.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** טבלת הזנת ציונים עם שמירה אוטומטית ומשוב מילולי בשורה.
**נדחה:** חלונית משוב מתקדמת; ייצוא CSV.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **כותרת** (bar): הזנת ציונים · כיתה ומקצוע · מבחן או מטלה · ייצוא CSV
- **טבלת הזנה** (table): שם · ציון (0-100) · הערה / משוב · עודכן
- **סיכום** (note): ממוצע כיתתי · מספר תלמידים ללא ציון
- **משוב מילולי** (note): חלונית צד לתלמיד נבחר, תבניות משפטים

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [Select](http://localhost:6006/?path=/story/components-select--playground) ◇
- [TextField](http://localhost:6006/?path=/story/components-textfield--playground) ◇
- [Checkbox](http://localhost:6006/?path=/story/components-checkbox--playground) ◇
- [Avatar](http://localhost:6006/?path=/story/components-avatar--playground) ◇
- [MetricCard](http://localhost:6006/?path=/story/components-metriccard--playground) ◇
- [GradeCell](http://localhost:6006/?path=/story/components-gradecell--playground) ◇
- [IconButton](http://localhost:6006/?path=/story/components-iconbutton--playground) ◇
- [Drawer](http://localhost:6006/?path=/story/components-drawer--playground)
- [Alert](http://localhost:6006/?path=/story/components-alert--playground)
- [Toast](http://localhost:6006/?path=/story/components-toast--playground)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- Enter או חץ למטה עובר לשורה הבאה כדי להזין ברצף.
- שמירה אוטומטית לכל תא, עם סימון עריכה אחרונה.
- פתיחת חלונית המשוב לתלמיד לא סוגרת את הטבלה.
- 'ייצוא CSV' מוריד את הציונים כפי שמוצגים.

## כללים ותנאים

- ציון מחוץ לטווח או לא מספרי נחסם ליד התא.
- שינוי ציון קיים נרשם בהיסטוריה (G03).
- ציון ריק שונה מאפס.
- משקל המבחן בציון הסופי מוגדר ב-G06.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02). בנוסף: שמירה נכשלה: תא מסומן באדום עם 'נסי שוב'

## API

- `GET /assessments/{id}/grades`
- `PUT /assessments/{id}/grades/bulk`
- `POST /grades/{id}/feedback`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** אין
**אוספים משותפים שהמסך אחראי על הכתיבה אליהם (המודל וה-seed באוספי הליבה):** grades, grade_feedback
**נקראים:** assessments, students

## קריטריוני קבלה

- [ ] הזנת כיתה שלמה אפשרית ברצף מקלדת בלבד.
- [ ] שגיאת טווח מוצגת ליד התא.
- [ ] הממוצע מתעדכן מיד.

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
