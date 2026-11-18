# X03 · דשבורד מנהל

**מפתחת:** C-06 (שני המסכים שלה: X03 ו-N05) · **מורכבות:** בינוני · **מודול:** דשבורד ומשותף
**צוות:** C · נוכחות, צוות וחשבון (Jira 3)

## מטרה

מסך הבית של ההנהלה: תמונת מצב אחת על נוכחות, ציונים וצוות, וקיצורי דרך למה שדורש טיפול היום.

**מי משתמש:** מנהל / הנהלה
**איך מגיעים:** מסך הבית אחרי התחברות של מנהל.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** ארבעה כרטיסי מדדים ורשימת 'דורש טיפול'.
**נדחה:** גרף מגמה וסינון לפי שכבה.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## אזורי המסך

- **מדדים עליונים** (cards): נוכחות היום (%) · תלמידים שנעדרו 3 ימים ברצף · מבחנים ללא ציונים · שיעורים ללא מורה (היום)
- **מגמת נוכחות** (chart): גרף קווי: 30 ימים אחרונים · סינון לפי שכבה
- **דורש טיפול** (list): התראות היעדרות חוזרת · אישורי יציאה ממתינים · הזמנות שלא אושרו
- **קיצורי דרך** (cards): תלמיד חדש · סימון נוכחות · הפקת תעודות

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [Badge](http://localhost:6006/?path=/story/components-badge--playground) ◇
- [AttendanceChip](http://localhost:6006/?path=/story/components-attendancechip--playground) ◇
- [MetricCard](http://localhost:6006/?path=/story/components-metriccard--playground) ◇
- [Card](http://localhost:6006/?path=/story/components-card--variants-and-states)
- [IconButton](http://localhost:6006/?path=/story/components-iconbutton--playground) ◇
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.
>
> גרף: אין רכיב משותף. בונים לפי מדריך העיצוב, בצבעי `chart-c1`–`chart-c6`, ועם תווית ישירה על הנתונים.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- לחיצה על מדד פותחת את המסך המפורט עם הסינון המתאים.
- סינון השכבה בגרף מעדכן רק את הגרף.

## כללים ותנאים

- הנתונים מתעדכנים בכל טעינה, ללא רענון אוטומטי.
- כל מדד מציג את שעת החישוב האחרונה.
- מוצג רק למי שיש לו הרשאת הנהלה.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02).

## API

- `GET /dashboard/summary`
- `GET /attendance/trend?days=30`
- `GET /alerts?status=open`
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** אין
**נקראים:** attendance_records, grades, attendance_alerts, attendance_exceptions, invites

## קריטריוני קבלה

- [ ] המדדים תואמים לנתוני המודולים האחרים.
- [ ] כל כרטיס מוביל למסך המפורט.
- [ ] בזמן טעינה מוצג שלד ולא מסך לבן.

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
