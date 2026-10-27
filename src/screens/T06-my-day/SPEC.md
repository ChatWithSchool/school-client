# T06 · היום שלי (מורה)

**מפתחת:** B-08 (שני המסכים שלה: T06 ו-T03) · **מורכבות:** בינוני · **מודול:** מערכת שעות
**צוות:** B · הגדרות ומערכת שעות (Jira 2)

## מטרה

המסך הראשון של מורה בבוקר: השיעורים של היום, ופעולות ישירות לכל שיעור.

**מי משתמש:** מורה
**איך מגיעים:** מסך הבית של מורה.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** רשימת שיעורי היום עם קישור לסימון נוכחות.
**נדחה:** התראות שינוי.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **כותרת** (bar): היום: [תאריך] · הבא בתור
- **שיעורי היום** (list): שעה · כיתה · מקצוע · חדר · פעולות: נוכחות, ציונים
- **התראות** (note): שינוי חדר או ממלא מקום היום

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [DatePicker](http://localhost:6006/?path=/story/components-datepicker--variants-and-states) ◇
- [Badge](http://localhost:6006/?path=/story/components-badge--playground) ◇
- [Card](http://localhost:6006/?path=/story/components-card--variants-and-states)
- [Alert](http://localhost:6006/?path=/story/components-alert--playground)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇
- [LessonBlock](http://localhost:6006/?path=/story/components-lessonblock--playground)

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- 'נוכחות' פותח את N01 כשהכיתה והשעה כבר נבחרו.
- השיעור הנוכחי מודגש.

## כללים ותנאים

- מוצג רק מה שהמורה מלמד היום.
- יום חופשה מציג הודעה ולא רשימה ריקה.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02). בנוסף: ריק: 'אין לך שיעורים היום.'

## API

- `GET /me/today`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** אין
**נקראים:** lessons, lesson_substitutions, staff_profiles

## קריטריוני קבלה

- [ ] מעבר לסימון נוכחות שומר את ההקשר.
- [ ] שינוי של ממלא מקום מופיע באותו יום.

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
