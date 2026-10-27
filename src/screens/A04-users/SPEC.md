# A04 · ניהול משתמשים והרשאות

**מפתחת:** B-02 (שני המסכים שלה: A04 ו-A09) · **מורכבות:** בינוני · **מודול:** הגדרות
**צוות:** B · הגדרות ומערכת שעות (Jira 2)

## מטרה

המקום שבו מנהל רואה את כל משתמשי המוסד, משנה תפקיד, משבית חשבון ומזמין חדשים.

**מי משתמש:** מנהל
**איך מגיעים:** תפריט: הגדרות > משתמשים.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** רשימה, סינון בסיסי, שינוי תפקיד והשבתה.
**נדחה:** איפוס סיסמה למשתמש.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **כותרת** (bar): משתמשים · כפתור: הזמנת משתמש
- **סינון** (filters): חיפוש בשם / אימייל · תפקיד · סטטוס (פעיל / מושבת / ממתין)
- **טבלת משתמשים** (table): שם · אימייל · תפקיד · סטטוס · כניסה אחרונה · פעולות
- **פעולות שורה** (actions): שינוי תפקיד · השבתה / הפעלה · איפוס סיסמה

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [SearchField](http://localhost:6006/?path=/story/components-searchfield--playground) ◇
- [Select](http://localhost:6006/?path=/story/components-select--playground) ◇
- [Badge](http://localhost:6006/?path=/story/components-badge--playground) ◇
- [Avatar](http://localhost:6006/?path=/story/components-avatar--playground) ◇
- [DropdownMenu](http://localhost:6006/?path=/story/components-dropdownmenu--closed)
- [IconButton](http://localhost:6006/?path=/story/components-iconbutton--playground) ◇
- [Modal](http://localhost:6006/?path=/story/components-modal--playground)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- שינוי תפקיד נפתח בחלון עם הסבר על ההרשאות שמתקבלות.
- השבתה מנתקת מיד את כל הסשנים של המשתמש.
- 'הזמנת משתמש' פותח את A07.

## כללים ותנאים

- מנהל לא יכול להשבית או להוריד תפקיד לעצמו.
- חייב להישאר לפחות מנהל פעיל אחד במוסד.
- שינויי תפקיד נרשמים ביומן הפעילות.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02). בנוסף: ריק: 'אין עדיין משתמשים. הזמיני את הראשון.'

## API

- `GET /users?role=&status=&q=`
- `PATCH /users/{id}`
- `POST /users/{id}/deactivate`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** אין
**נקראים:** users, roles

## קריטריוני קבלה

- [ ] חיפוש וסינון עובדים יחד.
- [ ] ניסיון להשבית את המנהל האחרון נחסם עם הסבר.
- [ ] אחרי שינוי תפקיד התפריט של המשתמש מתעדכן בכניסה הבאה.

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
