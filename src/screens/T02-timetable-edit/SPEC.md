# T02 · עריכת מערכת שעות

**מפתחת:** B-06 (שני המסכים שלה: T02 ו-I05) · **מורכבות:** מורכב · **מודול:** מערכת שעות
**צוות:** B · הגדרות ומערכת שעות (Jira 2)

## מטרה

בניית השיעורים: מי מלמד מה, איפה ומתי, עם התראה מיידית על התנגשויות מורה, כיתה או חדר.

**מי משתמש:** מנהל, רכז מערכת שעות
**איך מגיעים:** מ-T01 במצב עריכה.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** הוספה, עריכה ומחיקה של שיעור בטופס, עם בדיקת התנגשויות בשרת.
**נדחה:** גרירה בין תאים; טיוטה ופרסום.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **כותרת** (bar): עריכת מערכת שעות · מצב טיוטה / פורסם · פרסום
- **רשת עריכה** (grid): לחיצה על תא פותחת שיעור · גרירת שיעור בין תאים
- **חלון שיעור** (form): כיתה / קבוצה * · מקצוע * · מורה * · חדר · יום ושעה * · חזרתיות
- **התנגשויות** (note): התראה אדומה עם הסבר: מי, איפה ומתי חופף

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Select](http://localhost:6006/?path=/story/components-select--playground) ◇
- [TextField](http://localhost:6006/?path=/story/components-textfield--playground) ◇
- [Checkbox](http://localhost:6006/?path=/story/components-checkbox--playground) ◇
- [LessonBlock](http://localhost:6006/?path=/story/components-lessonblock--playground)
- [Modal](http://localhost:6006/?path=/story/components-modal--playground)
- [Alert](http://localhost:6006/?path=/story/components-alert--playground)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.
>
> רשת מערכת השעות נבנית במסך, וכל שיעור בתוכה הוא LessonBlock.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- שמירת שיעור בודקת התנגשויות לפני אישור.
- גרירה לתא תפוס מציגה את ההתנגשות ומציעה ביטול.
- עריכה במצב טיוטה אינה משפיעה על מי שצופה עד לפרסום.

## כללים ותנאים

- מורה, כיתה וחדר לא יכולים להיות בשני מקומות בו זמנית.
- קבוצה חוצת-כיתה חוסמת את כל הכיתות שלה.
- אי אפשר לשבץ בחדר מושבת.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02). בנוסף: קונפליקט: הודעה מיידית ליד התא, לא רק ב-Toast

## API

- `GET/POST/PUT/DELETE /lessons`
- `POST /lessons/validate`
- `POST /schedule/publish`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** lessons
**נקראים:** classes, staff_profiles, subjects, rooms

## קריטריוני קבלה

- [ ] כל סוגי ההתנגשויות נתפסים ומוצגים בשפה פשוטה.
- [ ] טיוטה לא נראית לצופים עד פרסום.
- [ ] הגרירה נגישה גם מהמקלדת.

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
