# T01 · מערכת שעות שבועית (תצוגות)

**מפתחת:** B-05 (שני המסכים שלה: T01 ו-I08) · **מורכבות:** מורכב · **מודול:** מערכת שעות
**צוות:** B · הגדרות ומערכת שעות (Jira 2)

## מטרה

התצוגה השבועית של מערכת השעות במבטים שונים: לפי כיתה, לפי מורה, לפי חדר. הורה ומחנך רואים קריאה בלבד.

**מי משתמש:** מנהל, רכז, מורה, מחנך, הורה
**איך מגיעים:** תפריט: מערכת שעות; מפרופיל מורה; מכרטיס כיתה.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** רשת שבועית לפי כיתה ולפי מורה; הדפסה דרך הדפדפן.
**נדחה:** מבט לפי חדר; ייצוא PDF.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **כותרת** (bar): מערכת שעות · בורר מבט: כיתה / מורה / חדר · הדפסה / PDF
- **בורר** (filters): הישות (כיתה, מורה או חדר) · שבוע
- **רשת שבועית** (grid): עמודות: ימי השבוע · שורות: שעות · תא: מקצוע, מורה, חדר
- **מקרא** (list): צבע לכל מקצוע · סימון ממלא מקום · סימון שיעור שבוטל

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Select](http://localhost:6006/?path=/story/components-select--playground) ◇
- [TextField](http://localhost:6006/?path=/story/components-textfield--playground) ◇
- [Checkbox](http://localhost:6006/?path=/story/components-checkbox--playground) ◇
- [Badge](http://localhost:6006/?path=/story/components-badge--playground) ◇
- [LessonBlock](http://localhost:6006/?path=/story/components-lessonblock--playground)
- [IconButton](http://localhost:6006/?path=/story/components-iconbutton--playground) ◇
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.
>
> רשת מערכת השעות נבנית במסך, וכל שיעור בתוכה הוא LessonBlock.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- מורה נפתח אצלו כברירת מחדל המבט האישי; הורה רואה את כיתת ילדו.
- 'PDF' מפיק קובץ ברור להדפסה על A4 לרוחב.
- במובייל התצוגה עוברת לרשימה יומית.

## כללים ותנאים

- במבט קריאה בלבד אין כפתורי עריכה.
- שיעור עם ממלא מקום מציג את שם החלופי.
- אירוע יומן (I07) מסמן יום חופשה ברשת.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02). בנוסף: ריק: 'עוד לא נבנתה מערכת שעות.' + קישור לעריכה (למנהל)

## API

- `GET /schedule?view=&id=&week=`
- `GET /schedule/export.pdf`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** אין
**נקראים:** lessons, rooms, classes, staff_profiles, subjects, events

## קריטריוני קבלה

- [ ] התצוגה תואמת לנתונים שנערכו ב-T02.
- [ ] קובץ ה-PDF קריא ומכיל כותרת וכיתה.
- [ ] במובייל אין גלילה אופקית.

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
