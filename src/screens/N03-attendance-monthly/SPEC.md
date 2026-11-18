# N03 · דוח נוכחות חודשי לכיתה

**מפתחת:** C-02 (שני המסכים שלה: N03 ו-A03) · **מורכבות:** בינוני · **מודול:** נוכחות
**צוות:** C · נוכחות, צוות וחשבון (Jira 3)

## מטרה

ריכוז חודשי לכיתה עם אחוזי נוכחות והיעדרויות, וייצוא לקובץ.

**מי משתמש:** מחנך, מנהל
**איך מגיעים:** מכרטיס כיתה או מתפריט נוכחות > דוחות.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** טבלת דוח חודשי וייצוא CSV.
**נדחה:** ייצוא PDF.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **סינון** (filters): כיתה * · חודש * · קבוצה (אופציונלי)
- **טבלת דוח** (table): שם · ימי נוכחות · היעדרויות · איחורים · אחוז
- **סיכום כיתה** (note): ממוצע כיתתי · מספר תלמידים מתחת לסף
- **ייצוא** (actions): Excel · PDF

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [Select](http://localhost:6006/?path=/story/components-select--playground) ◇
- [AttendanceChip](http://localhost:6006/?path=/story/components-attendancechip--playground) ◇
- [Avatar](http://localhost:6006/?path=/story/components-avatar--playground) ◇
- [Alert](http://localhost:6006/?path=/story/components-alert--playground)
- [Toast](http://localhost:6006/?path=/story/components-toast--playground)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- מיון בלחיצה על כותרת עמודה.
- ייצוא שומר את הסינון והמיון הנוכחיים.

## כללים ותנאים

- ימי חופשה לא נספרים.
- סף האחוז הנמוך מוגדר במוסד.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02).

## API

- `GET /classes/{id}/attendance/monthly`
- `GET .../export?format=`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** אין
**נקראים:** attendance_records, students, classes

## קריטריוני קבלה

- [ ] הקובץ המיוצא זהה למה שמוצג.
- [ ] תלמידים שהועברו מציגים רק את התקופה הרלוונטית.

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
