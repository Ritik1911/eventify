
import os
import re

from flask import Flask, render_template, request, redirect, url_for, flash
from werkzeug.security import generate_password_hash
from database import db

app = Flask(__name__)

# Flask Configuration
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-only-secret-change-me")

# Online (Render) par DATABASE_URL se PostgreSQL use hoga, local par SQLite
db_url = os.environ.get("DATABASE_URL", "sqlite:///eventify.db")
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)
app.config["SQLALCHEMY_DATABASE_URI"] = db_url
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {"pool_pre_ping": True}
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Connect Database
db.init_app(app)


# Registration Database Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    mobile = db.Column(db.String(10), nullable=False)
    college = db.Column(db.String(150), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    semester = db.Column(db.String(10), nullable=False)
    password = db.Column(db.String(255), nullable=False)


# Create Database Tables
with app.app_context():
    db.create_all()


# Home Page
@app.route("/")
def home():
    users = User.query.order_by(User.id.desc()).all()
    return render_template("index.html", users=users)


# Events Page
@app.route("/events")
def events():
    return render_template("events.html")


# About Page
@app.route("/about")
def about():
    return render_template("about.html")


# Contact Page
@app.route("/contact")
def contact():
    return render_template("contact.html")


# Login Page
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        flash("Login backend will be implemented in the next phase.", "info")
        return redirect(url_for("login"))

    return render_template("login.html")


# Registration Page
@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        # Get Form Data
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip().lower()
        mobile = request.form.get("mobile", "").strip()
        college = request.form.get("college", "").strip()
        department = request.form.get("department", "").strip()
        semester = request.form.get("semester", "").strip()
        password = request.form.get("password", "")
        confirm = request.form.get("confirm", "")
        terms = request.form.get("terms")

        # Validate Required Fields
        if not all([name, email, mobile, college, department,
                    semester, password, confirm]):
            flash("Please fill in all required fields.", "error")
            return redirect(url_for("register"))

        # Validate Email
        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
            flash("Please enter a valid email address.", "error")
            return redirect(url_for("register"))

        # Validate Mobile Number
        if not re.fullmatch(r"[0-9]{10}", mobile):
            flash("Mobile number must contain exactly 10 digits.", "error")
            return redirect(url_for("register"))

        # Validate Password
        if len(password) < 8:
            flash("Password must contain at least 8 characters.", "error")
            return redirect(url_for("register"))

        # Confirm Password
        if password != confirm:
            flash("Password and Confirm Password do not match.", "error")
            return redirect(url_for("register"))

        # Terms and Conditions
        if not terms:
            flash("Please accept the Terms and Conditions.", "error")
            return redirect(url_for("register"))

        # Check Duplicate Email
        existing_user = User.query.filter_by(email=email).first()

        if existing_user:
            flash("This email is already registered. Please log in.", "error")
            return redirect(url_for("register"))

        # Hash Password
        hashed_password = generate_password_hash(password)

        # Save User in Database
        new_user = User(
            name=name,
            email=email,
            mobile=mobile,
            college=college,
            department=department,
            semester=semester,
            password=hashed_password
        )

        try:
            db.session.add(new_user)
            db.session.commit()

            flash("Registration successful! Welcome to Eventify.", "success")
            return redirect(url_for("home"))

        except Exception:
            db.session.rollback()
            flash("Something went wrong. Please try again.", "error")
            return redirect(url_for("register"))

    return render_template("register.html")


# Payment Page
@app.route("/payment")
def payment():
    return render_template("payment.html")


# Run Flask Application
if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG") == "1")
