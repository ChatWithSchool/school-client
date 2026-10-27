# A07 · הזמנת משתמשים והזמנות ממתינות

**מפתחת:** B-01 (שני המסכים שלה: A07 ו-A02) · **מורכבות:** בינוני · **מודול:** הגדרות
**צוות:** B · הגדרות ומערכת שעות (Jira 2)

## מטרה

הזמנת מורים, הורים וצוות בקישור אישי, ומעקב אחר הזמנות שטרם נענו.

**מי משתמש:** מנהל
**איך מגיעים:** תפריט: הגדרות > הזמנות.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** הזמנה חדשה, רשימת ממתינות, שליחה חוזרת וביטול.
**נדחה:** לשונית 'נענו'.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## לשוניות

לכל לשונית יש פריים משלה ב-Figma. בקליינט מנהלים את הלשונית הפעילה ב-`?tab=` ב-URL: ממתינות (ולשונית ראשונה).

## אזורי המסך

- **לשוניות** (tabs): הזמנה חדשה · ממתינות · נענו
- **הזמנה חדשה** (form): אימייל * · תפקיד * · לכיתות / ילדים (לפי תפקיד) · הודעה אישית
- **הזמנות ממתינות** (table): אימייל · תפקיד · נשלחה ב · פגה ב · פעולות
- **פעולות** (actions): שלח הזמנה · שלח שוב · בטל הזמנה

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Tabs](http://localhost:6006/?path=/story/components-tabs--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [Select](http://localhost:6006/?path=/story/components-select--playground) ◇
- [TextField](http://localhost:6006/?path=/story/components-textfield--playground) ◇
- [Badge](http://localhost:6006/?path=/story/components-badge--playground) ◇
- [DropdownMenu](http://localhost:6006/?path=/story/components-dropdownmenu--closed)
- [IconButton](http://localhost:6006/?path=/story/components-iconbutton--playground) ◇
- [Modal](http://localhost:6006/?path=/story/components-modal--playground)
- [Alert](http://localhost:6006/?path=/story/components-alert--playground)
- [Toast](http://localhost:6006/?path=/story/components-toast--playground)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- שליחה יוצרת קישור חד-פעמי (שירות המייל מדומה בגרסה 1 ומוצג ביומן).
- ביטול הזמנה פוסל מיד את הקישור.

## כללים ותנאים

- אימייל כפול להזמנה פעילה נחסם.
- הזמנה פגה אחרי תקופה שהוגדרה במוסד.
- הזמנת הורה דורשת קישור לילד (A08).

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02). בנוסף: ריק: 'אין הזמנות ממתינות.'

## API

- `POST /invites`
- `GET /invites?status=pending`
- `DELETE /invites/{id}`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** אין
**אוספים משותפים שהמסך אחראי על הכתיבה אליהם (המודל וה-seed באוספי הליבה):** invites
**נקראים:** users, roles

## קריטריוני קבלה

- [ ] הזמנה ממתינה ניתנת לשליחה חוזרת ולביטול.
- [ ] בגרסה 1 תוכן המייל נראה ביומן ההזמנות.

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
