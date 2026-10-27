# S03 · כרטיס תלמיד

**מפתחת:** A-02 (שני המסכים שלה: S03 ו-S06) · **מורכבות:** בינוני · **מודול:** תלמידים וקבוצות
**צוות:** A · תלמידים וציונים (Jira 1)

## מטרה

מקום אחד שמרכז את כל המידע על תלמיד: פרטים, נוכחות, ציונים, הערות, מסמכים ותגיות. בספרינט 5 הוא הופך לתמונת מצב מרוכזת אחת.

**מי משתמש:** מנהל, מחנך, מורים של התלמיד, הורה (צפייה מוגבלת)
**איך מגיעים:** מ-S01, מחיפוש גלובלי, או מדשבורד.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** כותרת, תמצית ולשוניות פרטים, נוכחות, ציונים והערות; תגיות.
**נדחה:** לשונית מסמכים.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## לשוניות

לכל לשונית יש פריים משלה ב-Figma. בקליינט מנהלים את הלשונית הפעילה ב-`?tab=` ב-URL: נוכחות, ציונים, הערות התנהגות (ולשונית ראשונה).

## אזורי המסך

- **כותרת** (bar): שם התלמיד וכיתה · תגיות · פעולות: עריכה, העברת כיתה
- **תמצית** (cards): נוכחות החודש · ממוצע ציונים · הערות פתוחות
- **לשוניות** (tabs): פרטים · נוכחות · ציונים · הערות התנהגות · מסמכים
- **תוכן הלשונית הפעילה** (list): נתוני הלשונית נטענים בנפרד

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Tabs](http://localhost:6006/?path=/story/components-tabs--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [Badge](http://localhost:6006/?path=/story/components-badge--playground) ◇
- [AttendanceChip](http://localhost:6006/?path=/story/components-attendancechip--playground) ◇
- [Avatar](http://localhost:6006/?path=/story/components-avatar--playground) ◇
- [Tag](http://localhost:6006/?path=/story/components-tag--playground)
- [MetricCard](http://localhost:6006/?path=/story/components-metriccard--playground) ◇
- [Card](http://localhost:6006/?path=/story/components-card--variants-and-states)
- [IconButton](http://localhost:6006/?path=/story/components-iconbutton--playground) ◇
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.
>
> לוח חודשי: אין רכיב משותף. בונים רשת מהטוקנים; לסטטוס יום משתמשים ב-AttendanceChip או ב-Badge.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- כל לשונית נטענת רק כשפותחים אותה.
- תגיות מתווספות ומוסרות ישירות מהכותרת.
- הורה רואה רק לשוניות שהמוסד אישר (A09).

## כללים ותנאים

- כל לשונית מכבדת הרשאות שדה.
- אין גישה לתלמיד מחוץ לכיתות המורה.
- לשונית המסמכים (ספרינט 5) מאפשרת העלאה והורדה בלבד, ללא עריכת תוכן.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02). בנוסף: לשונית ריקה: הסבר + כפתור הוספה מתאים

## API

- `GET /students/{id}`
- `GET /students/{id}/summary`
- `POST /students/{id}/tags`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** אין
**אוספים משותפים שהמסך אחראי על הכתיבה אליהם (המודל וה-seed באוספי הליבה):** השדה tags של students
**נקראים:** students, attendance_records, grades, student_notes

## קריטריוני קבלה

- [ ] לשונית שמוסתרת מהורה אינה נטענת כלל.
- [ ] תגית חדשה מופיעה גם ברשימת התלמידים.
- [ ] זמן טעינת התמצית מתחת לשנייה.

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
