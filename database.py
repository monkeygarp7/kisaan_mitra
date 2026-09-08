import sqlite3

DATABASE = "crop_health.db"


def get_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def seed_diseases(connection):
    """
    Add disease knowledge to the diseases table.
    Only inserts records that do not already exist.
    """

    diseases = [
        # APPLE
        {
            "disease_name": "Apple___Apple_scab",
            "crop": "Apple",
            "symptoms": "Olive-green or brown spots on leaves; dark lesions on fruit; premature leaf drop",
            "severity": "Medium",
            "prevention": "Remove fallen leaves and infected plant material; maintain good airflow; avoid prolonged leaf wetness",
            "treatment": "Remove affected leaves and fruit where practical and maintain good orchard sanitation. Consult an agriculture expert if the disease continues to spread",
        },
        {
            "disease_name": "Apple___Black_rot",
            "crop": "Apple",
            "symptoms": "Brown or purple leaf spots; dead branches; dark circular lesions on fruit",
            "severity": "High",
            "prevention": "Remove dead wood and infected fruit; keep the orchard clean; improve airflow around plants",
            "treatment": "Remove affected plant material and dispose of infected fruit safely. Prune dead or diseased branches and seek expert advice for severe infections",
        },
        {
            "disease_name": "Apple___Cedar_apple_rust",
            "crop": "Apple",
            "symptoms": "Yellow-orange spots on leaves; orange lesions; premature leaf drop",
            "severity": "Medium",
            "prevention": "Remove nearby infected plant material where appropriate and maintain good airflow",
            "treatment": "Remove severely affected leaves and maintain orchard sanitation. Consult an agriculture expert for appropriate management",
        },
        {
            "disease_name": "Apple___healthy",
            "crop": "Apple",
            "symptoms": "No visible signs of disease; leaves and fruit appear normal",
            "severity": "Healthy",
            "prevention": "Continue regular crop monitoring, balanced watering and good field sanitation",
            "treatment": "No disease treatment is required. Continue normal crop care and monitor the plant regularly",
        },

        # BLUEBERRY
        {
            "disease_name": "Blueberry___healthy",
            "crop": "Blueberry",
            "symptoms": "No visible signs of disease; healthy green foliage and normal growth",
            "severity": "Healthy",
            "prevention": "Maintain proper watering, airflow and field sanitation; monitor plants regularly",
            "treatment": "No disease treatment is required. Continue normal crop care",
        },

        # CHERRY
        {
            "disease_name": "Cherry_(including_sour)___Powdery_mildew",
            "crop": "Cherry",
            "symptoms": "White powdery growth on leaves and young shoots; distorted or stunted new growth",
            "severity": "Medium",
            "prevention": "Improve airflow; avoid excessive moisture on foliage; remove badly affected plant material",
            "treatment": "Remove severely affected leaves and shoots where practical and improve airflow. Consult an agriculture expert if symptoms persist",
        },
        {
            "disease_name": "Cherry_(including_sour)___healthy",
            "crop": "Cherry",
            "symptoms": "No visible signs of disease; normal green leaves and healthy growth",
            "severity": "Healthy",
            "prevention": "Maintain good airflow, proper watering and regular crop monitoring",
            "treatment": "No disease treatment is required. Continue normal crop care",
        },

        # CORN
        {
            "disease_name": "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
            "crop": "Corn",
            "symptoms": "Long gray or brown rectangular lesions on leaves; progressive leaf discoloration",
            "severity": "High",
            "prevention": "Remove crop residue where appropriate; maintain field sanitation and good crop management",
            "treatment": "Remove or manage infected plant material where practical and monitor the crop closely. Consult an agriculture expert for severe outbreaks",
        },
        {
            "disease_name": "Corn_(maize)___Common_rust_",
            "crop": "Corn",
            "symptoms": "Small reddish-brown rust-colored spots on leaves; spots may develop on both leaf surfaces",
            "severity": "Medium",
            "prevention": "Use healthy planting material; maintain good field management and monitor plants regularly",
            "treatment": "Remove heavily affected plant material where practical and monitor disease progression. Seek expert advice if infection becomes severe",
        },
        {
            "disease_name": "Corn_(maize)___Northern_Leaf_Blight",
            "crop": "Corn",
            "symptoms": "Long gray-green or brown cigar-shaped lesions on leaves; drying of affected leaves",
            "severity": "High",
            "prevention": "Maintain field sanitation and manage crop residue; use healthy planting material",
            "treatment": "Remove or manage infected plant material where practical and monitor nearby plants for symptoms. Consult an agriculture expert for severe infections",
        },
        {
            "disease_name": "Corn_(maize)___healthy",
            "crop": "Corn",
            "symptoms": "No visible disease symptoms; healthy green leaves and normal growth",
            "severity": "Healthy",
            "prevention": "Maintain proper watering, field sanitation and regular crop monitoring",
            "treatment": "No disease treatment is required. Continue normal crop care",
        },

        # GRAPE
        {
            "disease_name": "Grape___Black_rot",
            "crop": "Grape",
            "symptoms": "Brown leaf spots; dark lesions on berries; infected berries may shrivel",
            "severity": "High",
            "prevention": "Remove infected fruit and plant debris; improve airflow; maintain vineyard sanitation",
            "treatment": "Remove infected fruit and plant material where practical. Improve airflow and consult an agriculture expert for continued spread",
        },
        {
            "disease_name": "Grape___Esca_(Black_Measles)",
            "crop": "Grape",
            "symptoms": "Leaf discoloration and spotting; affected berries may show dark spots; gradual vine decline",
            "severity": "High",
            "prevention": "Use healthy planting material; remove severely affected plant material and maintain vineyard sanitation",
            "treatment": "Remove severely affected plant material where practical and monitor the vine. Seek professional agricultural advice for management",
        },
        {
            "disease_name": "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
            "crop": "Grape",
            "symptoms": "Brown or dark leaf spots; yellowing and drying of affected leaves",
            "severity": "Medium",
            "prevention": "Improve airflow; remove fallen and infected leaves; avoid prolonged leaf wetness",
            "treatment": "Remove affected leaves and maintain vineyard sanitation. Consult an agriculture expert if symptoms continue",
        },
        {
            "disease_name": "Grape___healthy",
            "crop": "Grape",
            "symptoms": "No visible disease symptoms; healthy green foliage and normal fruit development",
            "severity": "Healthy",
            "prevention": "Maintain good airflow, proper watering and regular vineyard monitoring",
            "treatment": "No disease treatment is required. Continue normal crop care",
        },

        # ORANGE
        {
            "disease_name": "Orange___Haunglongbing_(Citrus_greening)",
            "crop": "Orange",
            "symptoms": "Uneven yellowing of leaves; yellow shoots; reduced fruit size; abnormal or poorly colored fruit",
            "severity": "High",
            "prevention": "Regularly inspect trees for symptoms and insect vectors; remove severely affected trees where recommended by agricultural authorities",
            "treatment": "There is no simple cure for infected trees. Isolate and manage affected plants according to local agricultural guidance and consult an agriculture expert promptly",
        },

        # PEACH
        {
            "disease_name": "Peach___Bacterial_spot",
            "crop": "Peach",
            "symptoms": "Small dark spots on leaves; leaf yellowing and drop; spots or lesions on fruit",
            "severity": "Medium",
            "prevention": "Improve airflow; avoid prolonged leaf wetness; remove infected plant material and maintain sanitation",
            "treatment": "Remove severely affected plant material where practical and improve orchard sanitation. Consult an agriculture expert for appropriate management",
        },
        {
            "disease_name": "Peach___healthy",
            "crop": "Peach",
            "symptoms": "No visible disease symptoms; healthy foliage and normal fruit development",
            "severity": "Healthy",
            "prevention": "Maintain proper watering, airflow and regular crop monitoring",
            "treatment": "No disease treatment is required. Continue normal crop care",
        },

        # PEPPER
        {
            "disease_name": "Pepper,_bell___Bacterial_spot",
            "crop": "Bell Pepper",
            "symptoms": "Small dark spots on leaves; leaf yellowing; raised or sunken spots on fruit",
            "severity": "Medium",
            "prevention": "Use healthy planting material; avoid working with wet plants; maintain field sanitation and airflow",
            "treatment": "Remove severely affected leaves and fruit where practical and maintain good sanitation. Consult an agriculture expert if symptoms spread",
        },
        {
            "disease_name": "Pepper,_bell___healthy",
            "crop": "Bell Pepper",
            "symptoms": "No visible disease symptoms; healthy green leaves and normal fruit development",
            "severity": "Healthy",
            "prevention": "Maintain proper watering, good airflow and regular monitoring",
            "treatment": "No disease treatment is required. Continue normal crop care",
        },

        # POTATO
        {
            "disease_name": "Potato___Early_blight",
            "crop": "Potato",
            "symptoms": "Dark circular leaf spots with ring-like patterns; yellowing around lesions; leaf drop",
            "severity": "Medium",
            "prevention": "Remove infected plant debris; avoid prolonged leaf wetness; maintain adequate spacing and airflow",
            "treatment": "Remove severely affected leaves and maintain field sanitation. Monitor nearby plants and consult an agriculture expert if symptoms increase",
        },
        {
            "disease_name": "Potato___Late_blight",
            "crop": "Potato",
            "symptoms": "Dark irregular leaf lesions; rapid browning of foliage; affected tubers may develop dark lesions",
            "severity": "High",
            "prevention": "Use healthy planting material; avoid prolonged leaf wetness; remove infected plant material promptly",
            "treatment": "Remove affected plant material where practical and isolate the problem area. Seek agricultural expert advice promptly because the disease can spread quickly",
        },
        {
            "disease_name": "Potato___healthy",
            "crop": "Potato",
            "symptoms": "No visible disease symptoms; healthy green foliage and normal growth",
            "severity": "Healthy",
            "prevention": "Use healthy planting material, maintain proper watering and monitor plants regularly",
            "treatment": "No disease treatment is required. Continue normal crop care",
        },

        # RASPBERRY
        {
            "disease_name": "Raspberry___healthy",
            "crop": "Raspberry",
            "symptoms": "No visible disease symptoms; healthy leaves and normal plant growth",
            "severity": "Healthy",
            "prevention": "Maintain good airflow, proper watering and regular crop monitoring",
            "treatment": "No disease treatment is required. Continue normal crop care",
        },

        # SOYBEAN
        {
            "disease_name": "Soybean___healthy",
            "crop": "Soybean",
            "symptoms": "No visible disease symptoms; healthy green foliage and normal growth",
            "severity": "Healthy",
            "prevention": "Maintain proper watering, field sanitation and regular monitoring",
            "treatment": "No disease treatment is required. Continue normal crop care",
        },

        # SQUASH
        {
            "disease_name": "Squash___Powdery_mildew",
            "crop": "Squash",
            "symptoms": "White powder-like patches on leaves and stems; yellowing or drying of affected leaves",
            "severity": "Medium",
            "prevention": "Improve airflow; avoid excessive humidity around foliage; remove severely affected leaves",
            "treatment": "Remove severely affected leaves where practical and improve airflow. Consult an agriculture expert if the disease continues to spread",
        },

        # STRAWBERRY
        {
            "disease_name": "Strawberry___Leaf_scorch",
            "crop": "Strawberry",
            "symptoms": "Dark purple or reddish spots on leaves; affected areas may dry and become scorched",
            "severity": "Medium",
            "prevention": "Remove infected leaves and debris; improve airflow; avoid prolonged leaf wetness",
            "treatment": "Remove severely affected leaves and maintain field sanitation. Monitor nearby plants and seek expert advice if symptoms spread",
        },
        {
            "disease_name": "Strawberry___healthy",
            "crop": "Strawberry",
            "symptoms": "No visible disease symptoms; healthy green leaves and normal growth",
            "severity": "Healthy",
            "prevention": "Maintain proper watering, good airflow and regular monitoring",
            "treatment": "No disease treatment is required. Continue normal crop care",
        },

        # TOMATO
        {
            "disease_name": "Tomato___Bacterial_spot",
            "crop": "Tomato",
            "symptoms": "Small dark spots on leaves and stems; lesions may appear on fruit",
            "severity": "Medium",
            "prevention": "Use healthy planting material; avoid working with wet foliage; maintain good field sanitation",
            "treatment": "Remove severely affected leaves and fruit where practical. Maintain sanitation and consult an agriculture expert if symptoms spread",
        },
        {
            "disease_name": "Tomato___Early_blight",
            "crop": "Tomato",
            "symptoms": "Dark circular leaf spots with concentric rings; yellowing around lesions; lower leaves affected first",
            "severity": "Medium",
            "prevention": "Remove infected leaves and plant debris; improve airflow; avoid prolonged leaf wetness",
            "treatment": "Remove affected leaves where practical and maintain good field sanitation. Monitor nearby plants and seek expert advice if the disease spreads",
        },
        {
            "disease_name": "Tomato___Late_blight",
            "crop": "Tomato",
            "symptoms": "Dark irregular lesions on leaves; rapid browning; affected fruit may develop dark areas",
            "severity": "High",
            "prevention": "Improve airflow; avoid prolonged leaf wetness; remove infected plant material promptly",
            "treatment": "Remove affected plant material where practical and monitor the crop closely. Consult an agriculture expert promptly because the disease can spread quickly",
        },
        {
            "disease_name": "Tomato___Leaf_Mold",
            "crop": "Tomato",
            "symptoms": "Yellow patches on upper leaf surfaces; olive-green or gray mold growth on leaf undersides",
            "severity": "Medium",
            "prevention": "Improve ventilation and reduce excessive humidity; avoid prolonged moisture on leaves",
            "treatment": "Remove severely affected leaves and improve airflow around plants. Consult an agriculture expert if symptoms continue",
        },
        {
            "disease_name": "Tomato___Septoria_leaf_spot",
            "crop": "Tomato",
            "symptoms": "Small circular leaf spots with dark borders; tiny dark centers; yellowing and leaf drop",
            "severity": "Medium",
            "prevention": "Remove infected leaves and debris; avoid overhead watering; improve airflow",
            "treatment": "Remove affected leaves where practical and maintain good sanitation. Monitor nearby plants for new symptoms",
        },
        {
            "disease_name": "Tomato___Spider_mites Two-spotted_spider_mite",
            "crop": "Tomato",
            "symptoms": "Fine speckling or yellowing of leaves; leaf drying; fine webbing may be visible",
            "severity": "Medium",
            "prevention": "Regularly inspect leaves; reduce plant stress; maintain appropriate watering and field hygiene",
            "treatment": "Remove badly affected leaves where practical and monitor the underside of leaves closely. Consult an agriculture expert for appropriate pest management",
        },
        {
            "disease_name": "Tomato___Target_Spot",
            "crop": "Tomato",
            "symptoms": "Brown circular spots with target-like rings on leaves and fruit; affected leaves may yellow",
            "severity": "Medium",
            "prevention": "Improve airflow; remove infected leaves and debris; avoid prolonged leaf wetness",
            "treatment": "Remove affected plant material where practical and maintain field sanitation. Consult an agriculture expert if symptoms spread",
        },
        {
            "disease_name": "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
            "crop": "Tomato",
            "symptoms": "Upward curling of leaves; yellowing; stunted growth; reduced fruit production",
            "severity": "High",
            "prevention": "Regularly inspect plants and manage insect vectors according to local agricultural guidance; remove severely affected plants where recommended",
            "treatment": "There is no direct cure for an infected plant. Remove severely affected plants where recommended and consult an agriculture expert about vector and crop management",
        },
        {
            "disease_name": "Tomato___Tomato_mosaic_virus",
            "crop": "Tomato",
            "symptoms": "Mottled light and dark green leaves; distorted foliage; reduced plant growth",
            "severity": "High",
            "prevention": "Use clean planting material and tools; remove infected plants; avoid spreading plant sap between plants",
            "treatment": "There is no direct cure for an infected plant. Remove severely affected plants and maintain strict sanitation. Consult an agriculture expert for management",
        },
        {
            "disease_name": "Tomato___healthy",
            "crop": "Tomato",
            "symptoms": "No visible disease symptoms; healthy green foliage and normal growth",
            "severity": "Healthy",
            "prevention": "Maintain proper watering, airflow, sanitation and regular crop monitoring",
            "treatment": "No disease treatment is required. Continue normal crop care",
        },
    ]

    cursor = connection.cursor()

    for disease in diseases:
        cursor.execute(
            """
            INSERT INTO diseases (
                disease_name,
                crop,
                symptoms,
                severity,
                prevention,
                treatment
            )
            SELECT ?, ?, ?, ?, ?, ?
            WHERE NOT EXISTS (
                SELECT 1
                FROM diseases
                WHERE disease_name = ?
            )
            """,
            (
                disease["disease_name"],
                disease["crop"],
                disease["symptoms"],
                disease["severity"],
                disease["prevention"],
                disease["treatment"],
                disease["disease_name"],
            ),
        )


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

    # Seed disease information
    seed_diseases(connection)

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
