"""
Sports Talent Recruitment Platform
Flask Backend — app.py
"""

from flask import (Flask, render_template, request, redirect,
                   url_for, session, flash, jsonify)
from flask_mail import Mail, Message
import mysql.connector
import bcrypt
import os
import secrets
import datetime
from functools import wraps
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'sports_recruit_2024_secret_xyz_changeme')

# ── Mail ──────────────────────────────────────────────────────
app.config['MAIL_SERVER']         = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT']           = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS']        = True
app.config['MAIL_USERNAME']       = os.environ.get('MAIL_USERNAME', '')
app.config['MAIL_PASSWORD']       = os.environ.get('MAIL_PASSWORD', '')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_USERNAME', '')
mail = Mail(app)

# ── DB ────────────────────────────────────────────────────────
def get_db():
    return mysql.connector.connect(
        host     = os.environ.get('DB_HOST', 'localhost'),
        user     = os.environ.get('DB_USER', 'root'),
        password = os.environ.get('DB_PASSWORD', ''),
        database = os.environ.get('DB_NAME', 'sports_recruitment'),
        autocommit=True
    )

# ── Decorators ────────────────────────────────────────────────
def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please login first.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated

def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if session.get('role') != role:
                flash('Access denied.', 'error')
                return redirect(url_for('index'))
            return f(*args, **kwargs)
        return decorated
    return decorator

# ── Email helpers ─────────────────────────────────────────────
def send_verification_email(email, name, token):
    verify_url = url_for('verify_email', token=token, _external=True)
    msg = Message('Verify Your Email – Sports Talent Platform', recipients=[email])
    msg.html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8f9ff;padding:40px;border-radius:12px">
      <div style="text-align:center;margin-bottom:30px">
        <h1 style="color:#FF6B1A;margin:0;font-size:28px">🏆 Sports Talent Platform</h1>
      </div>
      <h2 style="color:#1A2B5F">Welcome, {name}!</h2>
      <p style="color:#444;font-size:16px">Thank you for registering. Please verify your email address to get started.</p>
      <div style="text-align:center;margin:30px 0">
        <a href="{verify_url}"
           style="background:#FF6B1A;color:white;padding:14px 32px;text-decoration:none;
                  border-radius:8px;font-size:16px;font-weight:bold;display:inline-block">
          Verify My Email
        </a>
      </div>
      <p style="color:#888;font-size:14px">This link expires in 24 hours. If you didn't register, ignore this email.</p>
    </div>
    """
    mail.send(msg)

def send_reset_email(email, name, token):
    reset_url = url_for('reset_password', token=token, _external=True)
    msg = Message('Password Reset – Sports Talent Platform', recipients=[email])
    msg.html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8f9ff;padding:40px;border-radius:12px">
      <div style="text-align:center;margin-bottom:30px">
        <h1 style="color:#FF6B1A;margin:0;font-size:28px">🏆 Sports Talent Platform</h1>
      </div>
      <h2 style="color:#1A2B5F">Password Reset Request</h2>
      <p style="color:#444;font-size:16px">Hello <strong>{name}</strong>,<br>We received a request to reset your password.</p>
      <div style="text-align:center;margin:30px 0">
        <a href="{reset_url}"
           style="background:#FF6B1A;color:white;padding:14px 32px;text-decoration:none;
                  border-radius:8px;font-size:16px;font-weight:bold;display:inline-block">
          Reset My Password
        </a>
      </div>
      <p style="color:#888;font-size:14px">⚠️ This link expires in <strong>15 minutes</strong>. If you didn't request this, ignore this email.</p>
    </div>
    """
    mail.send(msg)

# ══════════════════════════════════════════════════════════════
#  ROUTES
# ══════════════════════════════════════════════════════════════

@app.route('/')
def index():
    db = get_db(); cur = db.cursor(dictionary=True)
    cur.execute("SELECT COUNT(*) c FROM players");   pc = cur.fetchone()['c']
    cur.execute("SELECT COUNT(*) c FROM coaches");   cc = cur.fetchone()['c']
    cur.execute("SELECT COUNT(*) c FROM recruitment"); rc = cur.fetchone()['c']
    cur.close(); db.close()
    return render_template('index.html', player_count=pc, coach_count=cc, recruit_count=rc)


# ── SIGNUP ────────────────────────────────────────────────────
@app.route('/signup', methods=['GET','POST'])
def signup():
    if request.method == 'POST':
        name     = request.form.get('name', '').strip()
        email    = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        confirm  = request.form.get('confirm_password', '')
        role     = request.form.get('role', '')

        # Basic validation
        if not all([name, email, password, confirm, role]):
            flash('All fields are required.', 'error')
            return redirect(url_for('signup'))
        if role not in ('player', 'coach'):
            flash('Invalid role selected.', 'error')
            return redirect(url_for('signup'))
        if password != confirm:
            flash('Passwords do not match.', 'error')
            return redirect(url_for('signup'))
        if len(password) < 6:
            flash('Password must be at least 6 characters.', 'error')
            return redirect(url_for('signup'))

        db = get_db(); cur = db.cursor(dictionary=True)

        # Check email conflicts
        cur.execute("SELECT role FROM users WHERE email = %s", (email,))
        rows = cur.fetchall()
        for row in rows:
            if row['role'] == role:
                flash(f'This email is already registered as a {role}. Please login.', 'error')
                cur.close(); db.close()
                return redirect(url_for('signup'))
            else:
                other = 'coach' if role == 'player' else 'player'
                flash(f'This email is already used for a {other} account. Please use a different email.', 'error')
                cur.close(); db.close()
                return redirect(url_for('signup'))

        hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        token  = secrets.token_urlsafe(48)

        cur.execute(
            "INSERT INTO users (name,email,password,role,verification_token,is_verified) VALUES(%s,%s,%s,%s,%s,%s)",
            (name, email, hashed, role, token, True)
        )
        cur.close(); db.close()


        flash('Account created! Please login.', 'success')

        return redirect(url_for('login'))

    return render_template('signup.html')


# ── EMAIL VERIFICATION ────────────────────────────────────────
@app.route('/verify_email/<token>')
def verify_email(token):
    db = get_db(); cur = db.cursor(dictionary=True)
    cur.execute("SELECT * FROM users WHERE verification_token=%s", (token,))
    user = cur.fetchone()
    if not user:
        cur.close(); db.close()
        flash('Invalid or expired verification link.', 'error')
        return redirect(url_for('login'))
    cur.execute("UPDATE users SET is_verified=TRUE, verification_token=NULL WHERE user_id=%s",
                (user['user_id'],))
    cur.close(); db.close()
    flash('Email verified! You can now login.', 'success')
    return redirect(url_for('login'))


# ── LOGIN ─────────────────────────────────────────────────────
@app.route('/login', methods=['GET','POST'])
def login():
    if 'user_id' in session:
        return redirect(url_for('player_dashboard') if session['role']=='player' else url_for('coach_dashboard'))

    if request.method == 'POST':
        email    = request.form.get('email','').strip().lower()
        password = request.form.get('password','')
        role     = request.form.get('role','')

        if not all([email, password, role]):
            flash('All fields are required.', 'error')
            return redirect(url_for('login'))

        db = get_db(); cur = db.cursor(dictionary=True)
        cur.execute("SELECT * FROM users WHERE email=%s AND role=%s", (email, role))
        user = cur.fetchone()
        cur.close(); db.close()

        if not user:
            flash('No account found with that email and role.', 'error')
            return redirect(url_for('login'))
        if not bcrypt.checkpw(password.encode(), user['password'].encode()):
            flash('Incorrect password.', 'error')
            return redirect(url_for('login'))

        session['user_id'] = user['user_id']
        session['name']    = user['name']
        session['role']    = user['role']
        session['email']   = user['email']
        flash(f'Welcome back, {user["name"]}! 🏆', 'success')
        return redirect(url_for('player_dashboard') if user['role']=='player' else url_for('coach_dashboard'))

    return render_template('login.html')


# ── LOGOUT ────────────────────────────────────────────────────
@app.route('/logout')
def logout():
    session.clear()
    flash('Logged out successfully.', 'info')
    return redirect(url_for('index'))


# ── PLAYER DASHBOARD ──────────────────────────────────────────
@app.route('/player_dashboard')
@login_required
@role_required('player')
def player_dashboard():
    db = get_db(); cur = db.cursor(dictionary=True)

    cur.execute("""
        SELECT p.*, u.name, u.email
        FROM players p JOIN users u ON p.user_id=u.user_id
        WHERE p.user_id=%s
    """, (session['user_id'],))
    player = cur.fetchone()

    requests_list = []; feedbacks = []
    if player:
        cur.execute("""
            SELECT r.*, u.name AS coach_name, c.sport_specialization
            FROM recruitment r
            JOIN coaches c ON r.coach_id=c.coach_id
            JOIN users u ON c.user_id=u.user_id
            WHERE r.player_id=%s ORDER BY r.date DESC
        """, (player['player_id'],))
        requests_list = cur.fetchall()

        cur.execute("""
            SELECT f.*, u.name AS coach_name
            FROM feedback f
            JOIN coaches c ON f.coach_id=c.coach_id
            JOIN users u ON c.user_id=u.user_id
            WHERE f.player_id=%s ORDER BY f.created_at DESC
        """, (player['player_id'],))
        feedbacks = cur.fetchall()

    cur.close(); db.close()
    return render_template('player_dashboard.html',
                           player=player,
                           requests=requests_list,
                           feedbacks=feedbacks)


# ── REGISTER / UPDATE PLAYER ──────────────────────────────────
@app.route('/register_player', methods=['GET','POST'])
@login_required
@role_required('player')
def register_player():
    if request.method == 'POST':
        age   = request.form.get('age')
        sport = request.form.get('sport','').strip()
        ht    = request.form.get('height','').strip()
        ach   = request.form.get('achievements','').strip()
        lvl   = request.form.get('competition_level','District')
        cemail= request.form.get('contact_email','').strip() or session['email']

        db = get_db(); cur = db.cursor(dictionary=True)
        cur.execute("SELECT player_id FROM players WHERE user_id=%s", (session['user_id'],))
        existing = cur.fetchone()

        if existing:
            cur.execute("""
                UPDATE players SET age=%s,sport=%s,height=%s,achievements=%s,
                competition_level=%s,contact_email=%s WHERE user_id=%s
            """, (age, sport, ht, ach, lvl, cemail, session['user_id']))
            flash('Profile updated successfully!', 'success')
        else:
            cur.execute("""
                INSERT INTO players(user_id,age,sport,height,achievements,competition_level,contact_email)
                VALUES(%s,%s,%s,%s,%s,%s,%s)
            """, (session['user_id'], age, sport, ht, ach, lvl, cemail))
            flash('Profile created successfully!', 'success')

        cur.close(); db.close()
        return redirect(url_for('player_dashboard'))

    db = get_db(); cur = db.cursor(dictionary=True)
    cur.execute("SELECT * FROM players WHERE user_id=%s", (session['user_id'],))
    player = cur.fetchone()
    cur.close(); db.close()
    return render_template('register_player.html', player=player)


# ── PUBLIC PLAYERS LIST ───────────────────────────────────────
@app.route('/players')
def players():
    sport  = request.args.get('sport','')
    age    = request.args.get('age','')
    level  = request.args.get('level','')
    search = request.args.get('search','')

    db = get_db(); cur = db.cursor(dictionary=True)
    q = "SELECT p.*, u.name FROM players p JOIN users u ON p.user_id=u.user_id WHERE 1=1"
    params = []
    if sport:  q += " AND p.sport=%s";              params.append(sport)
    if age:    q += " AND p.age=%s";                params.append(int(age))
    if level:  q += " AND p.competition_level=%s";  params.append(level)
    if search:
        q += " AND (u.name LIKE %s OR p.sport LIKE %s OR p.achievements LIKE %s)"
        params += [f'%{search}%']*3
    q += " ORDER BY p.player_id DESC"

    cur.execute(q, params)
    player_list = cur.fetchall()
    cur.close(); db.close()
    return render_template('players.html', players=player_list,
                           sport=sport, age=age, level=level, search=search)


# ── COACH DASHBOARD ───────────────────────────────────────────
@app.route('/coach_dashboard')
@login_required
@role_required('coach')
def coach_dashboard():
    db = get_db(); cur = db.cursor(dictionary=True)

    cur.execute("""
        SELECT c.*, u.name, u.email
        FROM coaches c JOIN users u ON c.user_id=u.user_id
        WHERE c.user_id=%s
    """, (session['user_id'],))
    coach = cur.fetchone()

    sent_list = []
    if coach:
        cur.execute("""
            SELECT r.*, u.name AS player_name, p.sport, p.competition_level, p.player_id
            FROM recruitment r
            JOIN players p ON r.player_id=p.player_id
            JOIN users u ON p.user_id=u.user_id
            WHERE r.coach_id=%s ORDER BY r.date DESC
        """, (coach['coach_id'],))
        sent_list = cur.fetchall()

    # All players for search panel
    sport_f = request.args.get('sport','')
    age_f   = request.args.get('age','')
    level_f = request.args.get('level','')
    srch    = request.args.get('search','')

    q = "SELECT p.*, u.name FROM players p JOIN users u ON p.user_id=u.user_id WHERE 1=1"
    params = []
    if sport_f:  q += " AND p.sport=%s";             params.append(sport_f)
    if age_f:    q += " AND p.age=%s";               params.append(int(age_f))
    if level_f:  q += " AND p.competition_level=%s"; params.append(level_f)
    if srch:
        q += " AND (u.name LIKE %s OR p.sport LIKE %s)"
        params += [f'%{srch}%']*2
    q += " ORDER BY p.player_id DESC"
    cur.execute(q, params)
    all_players = cur.fetchall()

    cur.close(); db.close()
    return render_template('coach_dashboard.html',
                           coach=coach,
                           sent_recruitments=sent_list,
                           players=all_players,
                           sport_f=sport_f, age_f=age_f, level_f=level_f, srch=srch)


# ── COACH PROFILE ─────────────────────────────────────────────
@app.route('/coach_profile', methods=['GET','POST'])
@login_required
@role_required('coach')
def coach_profile():
    if request.method == 'POST':
        sport_spec = request.form.get('sport_specialization','').strip()
        bio        = request.form.get('bio','').strip()
        experience = request.form.get('experience', 0)
        cemail     = request.form.get('contact_email','').strip() or session['email']

        db = get_db(); cur = db.cursor(dictionary=True)
        cur.execute("SELECT coach_id FROM coaches WHERE user_id=%s", (session['user_id'],))
        existing = cur.fetchone()
        if existing:
            cur.execute("""
                UPDATE coaches SET sport_specialization=%s,bio=%s,experience=%s,contact_email=%s
                WHERE user_id=%s
            """, (sport_spec, bio, experience, cemail, session['user_id']))
            flash('Profile updated!', 'success')
        else:
            cur.execute("""
                INSERT INTO coaches(user_id,sport_specialization,bio,experience,contact_email)
                VALUES(%s,%s,%s,%s,%s)
            """, (session['user_id'], sport_spec, bio, experience, cemail))
            flash('Coach profile created!', 'success')
        cur.close(); db.close()
        return redirect(url_for('coach_dashboard'))

    db = get_db(); cur = db.cursor(dictionary=True)
    cur.execute("""
        SELECT c.*, u.name, u.email
        FROM coaches c JOIN users u ON c.user_id=u.user_id
        WHERE c.user_id=%s
    """, (session['user_id'],))
    coach = cur.fetchone()
    cur.close(); db.close()
    return render_template('coach_profile.html', coach=coach)


# ── VIEW INDIVIDUAL PLAYER ─────────────────────────────────────
@app.route('/player/<int:player_id>')
def view_player(player_id):
    db = get_db(); cur = db.cursor(dictionary=True)
    cur.execute("""
        SELECT p.*, u.name FROM players p JOIN users u ON p.user_id=u.user_id
        WHERE p.player_id=%s
    """, (player_id,))
    player = cur.fetchone()

    if not player:
        cur.close(); db.close()
        flash('Player not found.', 'error')
        return redirect(url_for('players'))

    cur.execute("""
        SELECT f.*, u.name AS coach_name
        FROM feedback f
        JOIN coaches c ON f.coach_id=c.coach_id
        JOIN users u ON c.user_id=u.user_id
        WHERE f.player_id=%s ORDER BY f.created_at DESC
    """, (player_id,))
    feedbacks = cur.fetchall()

    # Check if logged-in coach has already recruited this player
    already_recruited = False
    coach = None
    if session.get('role') == 'coach':
        cur.execute("SELECT coach_id FROM coaches WHERE user_id=%s", (session['user_id'],))
        coach = cur.fetchone()
        if coach:
            cur.execute("""
                SELECT recruit_id FROM recruitment
                WHERE player_id=%s AND coach_id=%s AND status='pending'
            """, (player_id, coach['coach_id']))
            already_recruited = bool(cur.fetchone())

    cur.close(); db.close()
    return render_template('view_player.html', player=player,
                           feedbacks=feedbacks,
                           already_recruited=already_recruited,
                           coach=coach)


# ── SEND RECRUITMENT ──────────────────────────────────────────
@app.route('/send_recruitment', methods=['POST'])
@login_required
@role_required('coach')
def send_recruitment():
    player_id = request.form.get('player_id')
    message   = request.form.get('message','').strip()

    if not player_id or not message:
        flash('Player and message are required.', 'error')
        return redirect(request.referrer or url_for('coach_dashboard'))

    db = get_db(); cur = db.cursor(dictionary=True)
    cur.execute("SELECT coach_id FROM coaches WHERE user_id=%s", (session['user_id'],))
    coach = cur.fetchone()

    if not coach:
        flash('Please create your coach profile first.', 'warning')
        cur.close(); db.close()
        return redirect(url_for('coach_profile'))

    cur.execute("""
        SELECT recruit_id FROM recruitment
        WHERE player_id=%s AND coach_id=%s AND status='pending'
    """, (player_id, coach['coach_id']))
    if cur.fetchone():
        flash('You already have a pending request for this player.', 'warning')
        cur.close(); db.close()
        return redirect(request.referrer or url_for('coach_dashboard'))

    cur.execute("""
        INSERT INTO recruitment(player_id,coach_id,message,status,date)
        VALUES(%s,%s,%s,'pending',NOW())
    """, (player_id, coach['coach_id'], message))
    cur.close(); db.close()
    flash('Recruitment request sent! 🎯', 'success')
    return redirect(request.referrer or url_for('coach_dashboard'))


# ── UPDATE RECRUITMENT STATUS ─────────────────────────────────
@app.route('/update_recruitment', methods=['POST'])
@login_required
@role_required('player')
def update_recruitment():
    recruit_id = request.form.get('recruit_id')
    status     = request.form.get('status')
    if status not in ('accepted','rejected'):
        flash('Invalid status.', 'error')
        return redirect(url_for('player_dashboard'))
    db = get_db(); cur = db.cursor()
    cur.execute("UPDATE recruitment SET status=%s WHERE recruit_id=%s", (status, recruit_id))
    cur.close(); db.close()
    flash(f'Request {status}.', 'success')
    return redirect(url_for('player_dashboard'))


# ── ADD / UPDATE FEEDBACK ─────────────────────────────────────
@app.route('/add_feedback', methods=['POST'])
@login_required
@role_required('coach')
def add_feedback():
    player_id = request.form.get('player_id')
    rating    = request.form.get('rating')
    comment   = request.form.get('comment','').strip()

    db = get_db(); cur = db.cursor(dictionary=True)
    cur.execute("SELECT coach_id FROM coaches WHERE user_id=%s", (session['user_id'],))
    coach = cur.fetchone()
    if not coach:
        flash('Create your coach profile first.', 'warning')
        cur.close(); db.close()
        return redirect(url_for('coach_profile'))

    cur.execute("SELECT feedback_id FROM feedback WHERE player_id=%s AND coach_id=%s",
                (player_id, coach['coach_id']))
    existing = cur.fetchone()
    if existing:
        cur.execute("UPDATE feedback SET rating=%s,comment=%s,created_at=NOW() WHERE feedback_id=%s",
                    (rating, comment, existing['feedback_id']))
        flash('Feedback updated!', 'success')
    else:
        cur.execute("""
            INSERT INTO feedback(player_id,coach_id,rating,comment,created_at)
            VALUES(%s,%s,%s,%s,NOW())
        """, (player_id, coach['coach_id'], rating, comment))
        flash('Feedback submitted! ⭐', 'success')

    cur.close(); db.close()
    return redirect(request.referrer or url_for('coach_dashboard'))


# ── FORGOT PASSWORD ───────────────────────────────────────────
@app.route('/forgot_password', methods=['GET','POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form.get('email','').strip().lower()
        db = get_db(); cur = db.cursor(dictionary=True)
        cur.execute("SELECT * FROM users WHERE email=%s LIMIT 1", (email,))
        user = cur.fetchone()
        if user:
            token  = secrets.token_urlsafe(48)
            expiry = datetime.datetime.now() + datetime.timedelta(minutes=15)
            cur.execute("UPDATE users SET reset_token=%s,token_expiry=%s WHERE user_id=%s",
                        (token, expiry, user['user_id']))
            try:
                send_reset_email(email, user['name'], token)
            except Exception as e:
                app.logger.error(f'Reset email error: {e}')
        cur.close(); db.close()
        flash('If that email is registered, a reset link has been sent.', 'info')
        return redirect(url_for('forgot_password'))
    return render_template('forgot_password.html')


# ── RESET PASSWORD ────────────────────────────────────────────
@app.route('/reset_password/<token>', methods=['GET','POST'])
def reset_password(token):
    db = get_db(); cur = db.cursor(dictionary=True)
    cur.execute("SELECT * FROM users WHERE reset_token=%s", (token,))
    user = cur.fetchone()

    if not user or (user['token_expiry'] and datetime.datetime.now() > user['token_expiry']):
        cur.close(); db.close()
        flash('Invalid or expired reset link.', 'error')
        return redirect(url_for('forgot_password'))

    if request.method == 'POST':
        password = request.form.get('password','')
        confirm  = request.form.get('confirm_password','')
        if password != confirm:
            flash('Passwords do not match.', 'error')
            cur.close(); db.close()
            return redirect(url_for('reset_password', token=token))
        if len(password) < 6:
            flash('Password must be at least 6 characters.', 'error')
            cur.close(); db.close()
            return redirect(url_for('reset_password', token=token))

        hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        cur.execute("UPDATE users SET password=%s,reset_token=NULL,token_expiry=NULL WHERE user_id=%s",
                    (hashed, user['user_id']))
        cur.close(); db.close()
        flash('Password reset successfully! Please login.', 'success')
        return redirect(url_for('login'))

    cur.close(); db.close()
    return render_template('reset_password.html', token=token)


# ── RUN ───────────────────────────────────────────────────────
if __name__ == '__main__':
    app.run(debug=os.environ.get('FLASK_DEBUG','false').lower()=='true')
