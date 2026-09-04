import sqlite3

DATABASE = "crop_health.db"


def get_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def create_tables():
    connection = get_connection()

    cursor = connection.cursor()

    # Farmer table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS farmers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            village TEXT NOT NULL,
            crop TEXT NOT NULL,
            latitude REAL,
            longitude REAL
        )
    """)

    # Disease reports table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS disease_reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farmer_id INTEGER,
            image_name TEXT,
            disease TEXT,
            confidence REAL,
            severity TEXT,
            recommendation TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (farmer_id) REFERENCES farmers(id)
        )
    """)

        # Disease information table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS diseases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            disease_name TEXT NOT NULL,
            crop TEXT NOT NULL,
            symptoms TEXT,
            severity TEXT,
            prevention TEXT,
            treatment TEXT
        )
    """)

        # Crop information table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS crops (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farmer_id INTEGER NOT NULL,
            crop_name TEXT NOT NULL,
            variety TEXT,
            planting_date TEXT,
            location TEXT,
            FOREIGN KEY (farmer_id) REFERENCES farmers(id)
        )
    """)

    # Weather information table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS weather_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farmer_id INTEGER,
            crop_id INTEGER,
            latitude REAL,
            longitude REAL,
            temperature REAL,
            humidity REAL,
            weather_condition TEXT,
            wind_speed REAL,
            recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (farmer_id) REFERENCES farmers(id),
            FOREIGN KEY (crop_id) REFERENCES crops(id)
        )
    """)
    # Add missing columns to existing experts table
    expert_columns = [
        ("organization", "TEXT"),
        ("specialization", "TEXT"),
        ("phone", "TEXT"),
        ("email", "TEXT"),
        ("location", "TEXT")
    ]

    cursor.execute("PRAGMA table_info(experts)")
    existing_columns = [column[1] for column in cursor.fetchall()]

    for column_name, column_type in expert_columns:
        if column_name not in existing_columns:
            cursor.execute(
                f"ALTER TABLE experts ADD COLUMN {column_name} {column_type}"
            )

    # Agriculture experts / laboratories table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS experts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            specialization TEXT,
            phone TEXT,
            email TEXT,
            location TEXT
        )
    """)

    # Crop health monitoring / follow-up table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS follow_ups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farmer_id INTEGER NOT NULL,
            crop_id INTEGER NOT NULL,
            disease_report_id INTEGER,
            health_status TEXT NOT NULL,
            notes TEXT,
            follow_up_date TEXT,
            FOREIGN KEY (farmer_id) REFERENCES farmers(id),
            FOREIGN KEY (crop_id) REFERENCES crops(id),
            FOREIGN KEY (disease_report_id) REFERENCES disease_reports(id)
        )
    """)

    # Pest observation / pest monitoring table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pest_observations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farmer_id INTEGER NOT NULL,
            crop_id INTEGER NOT NULL,
            pest_name TEXT NOT NULL,
            pest_count INTEGER,
            detection_method TEXT,
            observation_date TEXT,
            notes TEXT,
            FOREIGN KEY (farmer_id) REFERENCES farmers(id),
            FOREIGN KEY (crop_id) REFERENCES crops(id)
        )
    """)
    # Expert / laboratory referral table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS referrals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farmer_id INTEGER NOT NULL,
            disease_report_id INTEGER NOT NULL,
            expert_id INTEGER NOT NULL,
            referral_reason TEXT,
            status TEXT DEFAULT 'Pending',
            referral_date TEXT,
            expert_response TEXT,
            FOREIGN KEY (farmer_id) REFERENCES farmers(id),
            FOREIGN KEY (disease_report_id) REFERENCES disease_reports(id),
            FOREIGN KEY (expert_id) REFERENCES experts(id)
        )
    """)

    connection.commit()
    connection.close()