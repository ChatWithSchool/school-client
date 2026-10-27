# A08 · קישור הורה לתלמיד

**מפתחת:** B-03 (שני המסכים שלה: A08 ו-I03) · **מורכבות:** בינוני · **מודול:** הגדרות
**צוות:** B · הגדרות ומערכת שעות (Jira 2)

## מטרה

קישור חשבון הורה לילד אחד או יותר, כדי שההורה יראה רק את נתוני ילדיו.

**מי משתמש:** מנהל, מזכירות
**איך מגיעים:** מתוך כרטיס תלמיד (S03) או מתוך A07.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** קישור הורה לתלמיד והסרת הקישור.
**נדחה:** הגדרת נראות נפרדת לכל הורה.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **כותרת** (bar): קישור הורים · שם התלמיד
- **הורים מקושרים** (list): שם ההורה · קרבה · הרשאות צפייה · הסרת קישור
- **קישור הורה חדש** (form): אימייל ההורה * · קרבה · מה ההורה רואה: נוכחות, ציונים, הערות
- **פעולות** (actions): קשר · בטל

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Select](http://localhost:6006/?path=/story/components-select--playground) ◇
- [TextField](http://localhost:6006/?path=/story/components-textfield--playground) ◇
- [TextArea](http://localhost:6006/?path=/story/components-textarea--playground)
- [Badge](http://localhost:6006/?path=/story/components-badge--playground) ◇
- [Avatar](http://localhost:6006/?path=/story/components-avatar--playground) ◇
- [Card](http://localhost:6006/?path=/story/components-card--variants-and-states)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- קישור הורה שאין לו חשבון שולח אליו הזמנה.
- הסרת קישור מבטלת את גישת ההורה לילד מיידית.

## כללים ותנאים

- הורה רואה רק ילדים מקושרים.
- הרשאות הצפייה נקבעות לפי ברירות המחדל של המוסד (A09) וניתנות לשינוי לכל הורה.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02).

## API

- `POST /students/{id}/guardians`
- `DELETE /students/{id}/guardians/{gid}`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** אין
**אוספים משותפים שהמסך אחראי על הכתיבה אליהם (המודל וה-seed באוספי הליבה):** students (השדה guardians: הקישור להורה נשמר ב-guardians[].userId)
**נקראים:** users, students

## קריטריוני קבלה

- [ ] הורה עם שני ילדים רואה בורר ילדים.
- [ ] אחרי הסרה ההורה כבר לא רואה את הילד.

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
