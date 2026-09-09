from flask import Flask, jsonify, request, render_template, session, redirect, url_for
from flask_cors import CORS
from database import get_db_connection, create_tables, add_default_cars

app = Flask(__name__,
    static_folder="static",
    static_url_path="/static"
    )

app.secret_key = "driveease-secret-key"
 

CORS(app)

create_tables()
add_default_cars()


# ================================
# PAGES
# ================================

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/dashboard")
def dashboard():

    if "user_id" not in session:
        return redirect(url_for("login_page"))

    return render_template("dashboard.html")


@app.route("/cars")
def cars_page():
    return render_template("cars.html")


# ================================
# GET CARS
# ================================

@app.route("/api/cars", methods=["GET"])
def get_cars():

    connection = get_db_connection()

    cars = connection.execute(
        "SELECT * FROM cars"
    ).fetchall()

    connection.close()

    return jsonify([dict(car) for car in cars])


# ================================
# CREATE BOOKING
# ================================

@app.route("/api/bookings", methods=["POST"])
def create_booking():

    data = request.get_json()

    required_fields = [
        "car_id",
        "customer_name",
        "customer_phone",
        "pickup_date",
        "return_date",
        "rental_days",
        "total_price"
    ]

    for field in required_fields:

        if field not in data:

            return jsonify({
                "success": False,
                "message": f"Missing field: {field}"
            }), 400

    connection = get_db_connection()

    connection.execute("""
        INSERT INTO bookings
        (
            car_id,
            customer_name,
            customer_phone,
            pickup_date,
            return_date,
            rental_days,
            total_price
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        data["car_id"],
        data["customer_name"],
        session["user_phone"],
        data["pickup_date"],
        data["return_date"],
        data["rental_days"],
        data["total_price"]
    ))

    connection.commit()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Booking created successfully!"
    }), 201


# ================================
# CONTACT FORM
# ================================

@app.route("/api/contact", methods=["POST"])
def contact():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    message = data.get("message")

    if not name or not email or not message:

        return jsonify({
            "success": False,
            "message": "All fields are required."
        }), 400

    connection = get_db_connection()

    connection.execute("""
        INSERT INTO contact_messages
        (name, email, message)
        VALUES (?, ?, ?)
    """, (
        name,
        email,
        message
    ))

    connection.commit()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Message received successfully!"
    }), 201


# ================================
# REGISTER
# ================================

@app.route("/register")
def register_page():
    return render_template("register.html")

@app.route("/api/register", methods=["POST"])
def register():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")

    if not name or not email or not phone or not password:

        return jsonify({
            "success": False,
            "message": "All fields are required."
        }), 400

    connection = get_db_connection()

    existing_user = connection.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    ).fetchone()

    if existing_user:

        connection.close()

        return jsonify({
            "success": False,
            "message": "An account with this email already exists."
        }), 400

    connection.execute("""
        INSERT INTO users
        (name, email, phone, password)
        VALUES (?, ?, ?, ?)
    """, (
        name,
        email,
        phone,
        password
    ))

    connection.commit()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Registration successful!"
    }), 201
    


# ================================
# RUN SERVER
# ================================

@app.route("/login")
def login_page():
    return render_template("login.html")

@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required."
        }), 400

    connection = get_db_connection()

    user = connection.execute(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        (email, password)
    ).fetchone()

    connection.close()

    if user:

        session["user_id"] = user["id"]
        session["user_name"] = user["name"]
        session["user_email"] = user["email"]
        session["user_phone"] = user["phone"]

        return jsonify({
            "success": True,
            "message": "Login successful!",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"]
            }
        }), 200

    return jsonify({
        "success": False,
        "message": "Invalid email or password."
    }), 401
    
@app.route("/my-bookings")
def my_bookings():

    if "user_id" not in session:
        return redirect(url_for("login_page"))

    connection = get_db_connection()

    bookings = connection.execute("""
        SELECT
            bookings.id,
            cars.name AS car_name,
            cars.image,
            bookings.pickup_date,
            bookings.return_date,
            bookings.rental_days,
            bookings.total_price
        FROM bookings
        JOIN cars ON bookings.car_id = cars.id
        WHERE bookings.customer_phone = ?
        ORDER BY bookings.id DESC
    """, (session["user_phone"],)).fetchall()

    connection.close()

    return render_template(
        "my_bookings.html",
        bookings=bookings,
        user_name=session["user_name"]
    )
@app.route("/api/my-bookings")
def api_my_bookings():

    if "user_id" not in session:
        return jsonify({
            "success": False,
            "message": "Please login first."
        }), 401

    connection = get_db_connection()

    bookings = connection.execute("""
        SELECT
            bookings.id,
            cars.name AS car_name,
            cars.image,
            cars.fuel,
            cars.seats,
            bookings.pickup_date,
            bookings.return_date,
            bookings.rental_days,
            bookings.total_price
        FROM bookings
        JOIN cars ON bookings.car_id = cars.id
        WHERE bookings.customer_phone = ?
        ORDER BY bookings.id DESC
    """, (session["user_phone"],)).fetchall()

    connection.close()

    return jsonify({
        "success": True,
        "bookings": [dict(booking) for booking in bookings]
    })

@app.route("/logout")
def logout():

    session.clear()

    return redirect(url_for("login_page"))

if __name__ == "__main__":
    app.run(debug=True)