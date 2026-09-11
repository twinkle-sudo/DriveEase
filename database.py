import sqlite3

DATABASE = "driveease.db"


def get_db_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def create_tables():
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS cars (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            fuel TEXT NOT NULL,
            seats INTEGER NOT NULL,
            price INTEGER NOT NULL,
            image TEXT,
            available INTEGER DEFAULT 1
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            car_id INTEGER NOT NULL,
            customer_name TEXT NOT NULL,
            customer_phone TEXT NOT NULL,
            pickup_date TEXT NOT NULL,
            return_date TEXT NOT NULL,
            rental_days INTEGER NOT NULL,
            total_price INTEGER NOT NULL,
            FOREIGN KEY (car_id) REFERENCES cars(id)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT NOT NULL,
            password TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()


def add_default_cars():
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT COUNT(*) FROM cars")
    count = cursor.fetchone()[0]

    if count == 0:
        cars = [
            ("BMW 3 Series", "Petrol", 5, 4500, "car1.jpg", 1),
            ("Mercedes-Benz C-Class", "Petrol", 5, 5500, "car2.jpg", 1),
            ("Toyota Fortuner", "Diesel", 7, 4000, "car3.jpg", 0),
            ("Lamborghini Urus", "Diesel", 5, 45000, "car4.jpg", 1),
            ("Ferrari Roma", "Petrol", 2, 50000, "car5.jpg", 1),
            ("Porsche 911 Carrera", "Diesel", 4, 32000, "car6.jpg", 1)
        ]

        cursor.executemany("""
            INSERT INTO cars
            (name, fuel, seats, price, image, available)
            VALUES (?, ?, ?, ?, ?, ?)
        """, cars)
        
        # Fix image names for existing cars
        connection.execute(
    "UPDATE cars SET image = 'car1.jpg' WHERE name = 'BMW 3 Series'"
  )

    connection.execute(
    "UPDATE cars SET image = 'car2.jpg' WHERE name = 'Mercedes-Benz C-Class'"
)

    connection.execute(
    "UPDATE cars SET image = 'car3.jpg' WHERE name = 'Toyota Fortuner'"
)

    connection.execute(
    "UPDATE cars SET image = 'car4.jpg' WHERE name = 'Lamborghini Urus'"
)

    connection.execute(
    "UPDATE cars SET image = 'car5.jpg' WHERE name = 'Ferrari Roma'"
)

    connection.execute(
    "UPDATE cars SET image = 'car6.jpg' WHERE name = 'Porsche 911 Carrera'"
)

    connection.commit()
    connection.close()


if __name__ == "__main__":
    create_tables()
    add_default_cars()
    print("DriveEase database created successfully!")