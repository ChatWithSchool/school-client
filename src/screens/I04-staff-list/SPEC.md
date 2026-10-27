# I04 · צוות בית הספר

**מפתחת:** C-03 (שני המסכים שלה: I04 ו-I02) · **מורכבות:** קל · **מודול:** צוות
**צוות:** C · נוכחות, צוות וחשבון (Jira 3)

## מטרה

רשימת כל אנשי הצוות עם סינון לפי תפקיד ומקצוע, ופתיחה מהירה של הפרופיל.

**מי משתמש:** מנהל, מזכירות
**איך מגיעים:** תפריט: צוות.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** רשימה, חיפוש, סינון והוספה מהירה.
**נדחה:** ייבוא מתוך המסך (נעשה ב-I02).

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **כותרת** (bar): צוות בית הספר · כפתורים: הוספת איש צוות, ייבוא מקובץ
- **סינון** (filters): חיפוש בשם · תפקיד · מקצוע · סטטוס
- **טבלת צוות** (table): שם · תפקיד · מקצועות · כיתות · סטטוס
- **מונה** (note): סה"כ אנשי צוות מוצגים

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
- [IconButton](http://localhost:6006/?path=/story/components-iconbutton--playground) ◇
- [Modal](http://localhost:6006/?path=/story/components-modal--playground)
- [Alert](http://localhost:6006/?path=/story/components-alert--playground)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- לחיצה על שורה פותחת את פרופיל המורה (I05).
- הוספה מהירה פותחת חלון עם שם, אימייל ותפקיד בלבד.

## כללים ותנאים

- מחיקה היא מחיקה רכה; איש צוות עם שיעורים במערכת מחייב החלפה לפני השבתה.
- מציג רק צוות המוסד הנוכחי.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02). בנוסף: ריק: 'עוד לא נוסף צוות. אפשר לייבא קובץ.'

## API

- `GET /staff?role=&subject=&q=`
- `POST /staff`
- `PATCH /staff/{id}`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** אין
**נקראים:** staff_profiles

## קריטריוני קבלה

- [ ] סינון משולב עובד.
- [ ] השבתת מורה עם שיעורים מציגה אזהרה.
- [ ] מצב ריק מציע ייבוא.

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
