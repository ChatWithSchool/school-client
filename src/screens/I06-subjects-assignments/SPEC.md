# I06 · מקצועות ושיוכי הוראה

**מפתחת:** B-07 (שני המסכים שלה: I06 ו-T04) · **מורכבות:** בינוני · **מודול:** הגדרות
**צוות:** B · הגדרות ומערכת שעות (Jira 2)

## מטרה

ניהול רשימת המקצועות וקביעה איזה מורה מלמד איזה מקצוע באיזו כיתה.

**מי משתמש:** מנהל, רכז
**איך מגיעים:** תפריט: הגדרות > מקצועות ושיוך.

## מה נבנה בגרסה 1 (v1-lite)

**נכלל:** רשימת מקצועות ושיוך מורה לכיתה בטופס.
**נדחה:** מטריצת שיוך אינטראקטיבית.

כשיש סתירה בין המפרט המלא להיקף v1-lite, v1-lite קובע.

## לשוניות

לכל לשונית יש פריים משלה ב-Figma. בקליינט מנהלים את הלשונית הפעילה ב-`?tab=` ב-URL: שיוך הוראה (ולשונית ראשונה).

## אזורי המסך

- **לשוניות** (tabs): מקצועות · שיוך הוראה
- **מקצועות** (table): שם המקצוע · קוד · שכבות · פעולות
- **שיוך הוראה: סינון** (filters): שכבה · כיתה · מקצוע
- **שיוך הוראה ב-v1-lite**: בחירת שכבה, כיתה, מקצוע ומורה בטופס. המטריצה האינטראקטיבית המתוארת בהמשך המפרט המלא נדחתה.

<!-- shared-components:start -->

## רכיבים משותפים

בונים את המסך רק מהרכיבים שב-`src/components/ui`: `import { Button } from '../../components/ui'`.
◇ = מחובר בפריים ב-Figma: לוחצות עליו ורואות בחלונית הימנית את שורת הקוד. בלי ◇ = רואים ב-Storybook (`npm run storybook`). הקישורים פותחים את ה-story כש-Storybook רץ.

- [PageHeader](http://localhost:6006/?path=/story/components-pageheader--playground) ◇
- [Tabs](http://localhost:6006/?path=/story/components-tabs--playground) ◇
- [Table](http://localhost:6006/?path=/story/components-table--variants-and-states)
- [Select](http://localhost:6006/?path=/story/components-select--playground) ◇
- [DropdownMenu](http://localhost:6006/?path=/story/components-dropdownmenu--closed)
- [IconButton](http://localhost:6006/?path=/story/components-iconbutton--playground) ◇
- [Modal](http://localhost:6006/?path=/story/components-modal--playground)
- [Toast](http://localhost:6006/?path=/story/components-toast--playground)
- [Button](http://localhost:6006/?path=/story/components-button--playground) ◇

> המסגרת (סרגל עליון, תפריט צד ולשוניות המודול) מגיעה מ-AppShell. לא בונים אותה במסך.
>
> מצבי טעינה, ריק ושגיאה: `Table` (טעינה וריק מובנים), `EmptyState`, ו-`LoadingSkeleton` / `ErrorState` מ-`components/StateViews`.

props ודוגמאות לכל רכיב: מדריך הרכיבים המשותפים (בריפו docs: `school-docs/design-kit/components.html`). מה שלא ברשימה: שואלות את ראשת הצוות לפני שבונות.
<!-- shared-components:end -->

## פעולות ותגובות

- הוספת מקצוע נשמרת בשרת ומעדכנת את הרשימה.
- בחירת מורה בטופס שומרת מיד ומציגה אישור קצר; בחירה ב"ללא שיוך" מסירה את השיוך.
- מחיקת מקצוע אינה זמינה ב-v1-lite עד שניתן לבדוק בשרת הפניות משיעורים ומציונים.

## כללים ותנאים

- שם מקצוע ייחודי בתוך המוסד.
- אפשר מורה אחד לכמה כיתות וכמה מורים לכיתה.
- שינוי שיוך אינו מוחק ציונים קיימים.

## מצבי המסך

טעינה, ריק, שגיאה ואין הרשאה לפי מסך המצבים המשותף (X02).

## API

- `GET/POST /subjects`
- `GET /teaching-assignments` (נתוני כיתות, מורות ושיוכים לטופס)
- `PUT /classes/{id}/teaching-assignments` (שמירה או ניקוי של שיוך מקצוע בכיתה)
  החוזה המלא ב-`openapi/openapi.yaml`.

## אוספים (Mongoose)

**בבעלות המסך:** אין
**אוספים משותפים שהמסך אחראי על הכתיבה אליהם (המודל וה-seed באוספי הליבה):** teaching_assignments
**נקראים:** subjects, staff_profiles, classes

## קריטריוני קבלה

- [ ] מקצוע חדש נשמר ומופיע ברשימת המקצועות.
- [ ] שיוך או הסרת מורה נשמרים בשרת ונשארים לאחר טעינה מחדש.
- [ ] שיוך ללא מורה מסומן ויזואלית בטופס.

## שלבי העבודה

| ספרינט | שלב                            |
| ------ | ------------------------------ |
| 1      | קליינט                         |
| 2      | סכמות ו-seed                   |
| 2      | סרבר א': חוזה ו-GET            |
| 3      | סרבר ב': כתיבה, הרשאות ושגיאות |
| 4      | חיבור מקצה לקצה                |
| 5      | בדיקות אוטומטיות               |

פריימי Figma של המסך המלא מפורטים בתת-המשימה בג׳ירה. ב-v1-lite משתמשים בטופס במקום במטריצה האינטראקטיבית.
