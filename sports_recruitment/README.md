# Sports Talent Recruitment Platform

A full-stack web application connecting rural sports athletes with coaches.

---

## 🚀 Quick Start (Local)

### 1. Setup MySQL

```bash
mysql -u root -p < database/schema.sql
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your DB and email credentials
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run locally

```bash
python app.py
```

Visit: http://localhost:5000

---

## ☁️ Deploy on Render

### Step 1 — Create a Render account at render.com

### Step 2 — Create a MySQL database
- In Render dashboard, create a new **MySQL** database
- Copy the connection details

### Step 3 — Create a Web Service
- Connect your GitHub repo
- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn app:app`

### Step 4 — Add Environment Variables in Render dashboard:

| Variable       | Value                         |
|----------------|-------------------------------|
| SECRET_KEY     | (random 32+ char string)      |
| DB_HOST        | (from Render MySQL)           |
| DB_USER        | (from Render MySQL)           |
| DB_PASSWORD    | (from Render MySQL)           |
| DB_NAME        | sports_recruitment            |
| MAIL_SERVER    | smtp.gmail.com                |
| MAIL_PORT      | 587                           |
| MAIL_USERNAME  | your@gmail.com                |
| MAIL_PASSWORD  | your_app_password             |

### Step 5 — Initialize the database
Connect to your Render MySQL and run `database/schema.sql`

---

## 📁 Project Structure

```
sports_recruitment/
├── app.py                  # Flask backend (all routes)
├── requirements.txt        # Python dependencies
├── .env.example            # Environment variable template
├── templates/
│   ├── base.html           # Base layout (navbar, footer)
│   ├── index.html          # Landing page
│   ├── login.html          # Login
│   ├── signup.html         # Register
│   ├── forgot_password.html
│   ├── reset_password.html
│   ├── player_dashboard.html
│   ├── register_player.html
│   ├── coach_dashboard.html
│   ├── coach_profile.html
│   ├── players.html        # Public players list
│   └── view_player.html    # Individual player profile
├── static/
│   ├── style.css           # Full sports-themed CSS
│   └── script.js           # Theme, i18n, tabs, modals
└── database/
    └── schema.sql          # MySQL schema
```

---

## 🌟 Features

| Feature | Details |
|---|---|
| Auth | Email verification, bcrypt passwords, role-based login |
| Email Uniqueness | Same email can't be both player AND coach |
| Language | English / मराठी / हिंदी — toggle in navbar |
| Dark Mode | Light/dark theme toggle persisted in localStorage |
| Player Profiles | Sport, age, height, achievements, competition level badge |
| Coach Dashboard | Search/filter players, send recruitment, give feedback |
| Recruitment | Send requests, track Pending/Accepted/Rejected status |
| Ratings | 1–5 star ratings with coach comments |
| Password Reset | 15-minute token reset via email |
| Public Listing | Players visible to everyone without login |

---

## 🎨 Tech Stack

- **Backend**: Python + Flask
- **Database**: MySQL (mysql-connector-python)
- **Email**: Flask-Mail + Gmail SMTP
- **Auth**: bcrypt + Flask sessions
- **Frontend**: HTML5 + CSS3 + Vanilla JS
- **Fonts**: Oswald + Nunito Sans (Google Fonts)
- **Deploy**: Render + Gunicorn

---

## 📧 Gmail App Password Setup

1. Go to Google Account → Security → 2-Step Verification (enable)
2. Go to Security → App Passwords
3. Generate password for "Mail"
4. Use that 16-char password as `MAIL_PASSWORD`
