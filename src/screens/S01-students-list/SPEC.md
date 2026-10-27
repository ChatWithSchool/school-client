# S01 · רשימת תלמידים

**מפתחת:** A-01 (שני המסכים שלה: S01 ו-S02) · **מורכבות:** בינוני · **מודול:** תלמידים וקבוצות
**צוות:** A · תלמידים וציונים (Jira 1)

## מטרה

המסך המרכזי לעבודה עם תלמידים: חיפוש, סינון, פתיחת כרטיס והוספה מהירה.

**מי משתמש:** מנהל, מזכירות, מחנך, מורה (לפי כיתותיו)
**איך מגיעים:** תפריט: תלמידים.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** רשימה, חיפוש, סינון כיתה וסטטוס, ועימוד.
**נדחה:** סינון לפי תגית.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **כותרת** (bar): תלמידים · כפתורים: תלמיד חדש, ייבוא מקובץ
- **סינון** (filters): חיפוש בשם / תעודת זהות · שכבה · כיתה · תגית · סטטוס
- **טבלת תלמידים** (table): שם · כיתה · הורה ראשי · תגיות · סטטוס
- **תחתית** (note): עימוד: 25 / 50 / 100 בעמוד · סה"כ תוצאות

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [Pagination](http://localhost:6006/?path=/story/components-pagination--playground)
- [SearchField](http://localhost:6006/?path=/story/components-searchfield--playground) ◇
- [Select](http://localhost:6006/?path=/story/components-select--playground) ◇
- [Checkbox](http://localhost:6006/?path=/story/components-checkbox--playground) ◇
- [Badge](http://localhost:6006/?path=/story/components-badge--playground) ◇
- [AttendanceChip](http://localhost:6006/?path=/story/components-attendancechip--playground) ◇
- [Avatar](http://localhost:6006/?path=/story/components-avatar--playground) ◇
- [Tag](http://localhost:6006/?path=/story/components-tag--playground)
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

- לחיצה על שורה פותחת את כרטיס התלמיד (S03).
- בחירת כמה שורות מציגה סרגל פעולות קבוצתיות (S10).
- סינון נשמר בכתובת כך שאפשר לשתף ולחזור אחורה.

## כללים ותנאים

- מורה רואה רק תלמידי כיתותיו.
- מחיקה היא רכה בלבד.
- החיפוש מתעלם מניקוד וממקפים.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02). בנוסף: ריק: 'עוד לא נוספו תלמידים.'; אין תוצאות: 'לא נמצאו תלמידים מתאימים' + איפוס סינון

## API

- `GET /students?q=&class=&tag=&page=&size=`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** אין
**נקראים:** students, classes

## קריטריוני קבלה

- [ ] חיפוש וסינון מחזירים תוצאות בפחות משנייה על כמה מאות תלמידים.
- [ ] מצב ריק מציע הוספה או ייבוא.
- [ ] הסינון נשמר ברענון.

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
