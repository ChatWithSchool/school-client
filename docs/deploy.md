# פריסה אוטומטית של הקליינט

אחרי מיזוג ל-`dev` או ל-`stage`, ה-workflow ב-`.github/workflows/ci.yml` בודק, בונה ופורס:

| ענף     | כתובת                           |
| ------- | ------------------------------- |
| `dev`   | https://cws-dev.safeai613.com   |
| `stage` | https://cws-stage.safeai613.com |

**איך:** הבנייה נעשית פעם אחת (`npm run build`), והתיקייה `dist` מועתקת ב-SSH למופע ל-`/srv/cws/<סביבה>/client/releases/<commit>/`. הקישור `current` מוחלף בצעד אחד, ו-nginx מגיש ממנו. נשמרות חמש גרסאות אחרונות.

**כתובת ה-API** היא `/api` (אותה כתובת של הדפים), ולכן אין להגדיר `VITE_API_URL` בפריסה, ואין צורך בבנייה נפרדת לכל סביבה. את `VITE_USE_MOCKS` משאירים כבויה.

**הקמה חד-פעמית** (מפתח SSH, Secrets של GitHub, DNS ו-nginx) מתוארת במדריך של השרת: `school-server/docs/deploy-aws.md`. אותם ארבעה Secrets של החיבור (`EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`, `EC2_KNOWN_HOSTS`) נדרשים גם כאן (המסד וסוד ה-JWT נדרשים רק בשרת), בכל אחת משתי הסביבות `dev` ו-`stage`.

**חזרה לגרסה קודמת:** ב-`/srv/cws/dev/client` מריצים `ls -t releases`, ואז `ln -sfn releases/<גרסה> current.new && mv -Tf current.new current`.
