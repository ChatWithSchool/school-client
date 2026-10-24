# S09 · תוצאות חיפוש גלובלי

**מפתחת:** A-05 (שני המסכים שלה: S09 ו-S08) · **מורכבות:** בינוני · **מודול:** תלמידים וקבוצות
**צוות:** A · תלמידים וציונים (Jira 1)

## מטרה

חיפוש אחד על פני תלמידים, צוות וכיתות, עם תוצאות מקובצות.

**מי משתמש:** כל המשתמשים המחוברים
**איך מגיעים:** שדה החיפוש בסרגל העליון (X01).

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** עמוד תוצאות חיפוש מקובצות לפי סוג.
**נדחה:** השלמה אוטומטית בסרגל העליון.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## לשוניות

לכל לשונית יש פריים משלה ב-Figma. בקליינט מנהלים את הלשונית הפעילה ב-`?tab=` ב-URL: תלמידים, צוות, כיתות (ולשונית ראשונה).

## אזורי המסך

- **כותרת** (bar): תוצאות עבור: [מונח חיפוש]
- **קבוצות** (tabs): הכול · תלמידים · צוות · כיתות
- **תוצאות** (list): שם · סוג · פרט מזהה (כיתה / תפקיד)

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Tabs](http://localhost:6006/?path=/story/components-tabs--playground) ◇
- [SearchField](http://localhost:6006/?path=/story/components-searchfield--playground) ◇
- [Select](http://localhost:6006/?path=/story/components-select--playground) ◇
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

- חצים ו-Enter מנווטים בין תוצאות בהשלמה אוטומטית.
- 'הצג את כל התוצאות' פותח עמוד זה.

## כללים ותנאים

- התוצאות מכבדות הרשאות: מורה לא מוצא תלמיד מחוץ לכיתותיו.
- חיפוש מתחיל אחרי שתי אותיות.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02). בנוסף: אין תוצאות: 'לא מצאנו כלום עבור [מונח]'

## API

- `GET /search?q=&types=`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** אין
**נקראים:** students, staff_profiles, classes

## קריטריוני קבלה

- [ ] תוצאות מופיעות תוך שניות ספורות.
- [ ] התפקיד קובע מה מוחזר.

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
