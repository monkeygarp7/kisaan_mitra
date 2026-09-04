from fastapi import FastAPI, HTTPException, UploadFile, File

from database import create_tables, get_connection

import requests
import os
import uuid

from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="SIH26131 Crop Health Backend"
)
UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# Create database tables
create_tables()


@app.get("/")
def home():
    return {
        "message": "SIH26131 Backend is Running!"
    }


# ---------------------------------------
# REGISTER FARMER
# ---------------------------------------

@app.post("/farmers")
def create_farmer(
    name: str,
    phone: str,
    village: str,
    crop: str,
    latitude: float = None,
    longitude: float = None
):

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO farmers
        (name, phone, village, crop, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        name,
        phone,
        village,
        crop,
        latitude,
        longitude
    ))

    connection.commit()

    farmer_id = cursor.lastrowid

    connection.close()

    return {
        "message": "Farmer registered successfully",
        "farmer_id": farmer_id
    }

    # ---------------------------------------
# GET FARMER DETAILS
# ---------------------------------------

@app.get("/farmers/{farmer_id}")
def get_farmer(farmer_id: int):

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(
        "SELECT * FROM farmers WHERE id = ?",
        (farmer_id,)
    )

    farmer = cursor.fetchone()

    connection.close()

    if farmer is None:
        raise HTTPException(
            status_code=404,
            detail="Farmer not found"
        )

    return {
        "id": farmer["id"],
        "name": farmer["name"],
        "phone": farmer["phone"],
        "village": farmer["village"],
        "crop": farmer["crop"],
        "latitude": farmer["latitude"],
        "longitude": farmer["longitude"]
    }

# ---------------------------------------
# UPLOAD CROP IMAGE
# ---------------------------------------

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):

    # Check file type

    if file.content_type not in [
        "image/jpeg",
        "image/png",
        "image/jpg"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Only JPG and PNG images are allowed"
        )

    # Create unique filename

    extension = file.filename.split(".")[-1]

    filename = f"{uuid.uuid4()}.{extension}"

    filepath = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    # Read image

    contents = await file.read()

    # Save image

    with open(filepath, "wb") as image:
        image.write(contents)

    return {
        "message": "Image uploaded successfully",
        "filename": filename
    }

# ---------------------------------------
# CROP DISEASE PREDICTION
# ---------------------------------------

@app.post("/predict")
async def predict_disease(file: UploadFile = File(...)):

    # Check file type
    if file.content_type not in [
        "image/jpeg",
        "image/png",
        "image/jpg"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Only JPG and PNG images are allowed"
        )

    # Save image
    extension = file.filename.split(".")[-1]

    filename = f"{uuid.uuid4()}.{extension}"

    filepath = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    contents = await file.read()

    with open(filepath, "wb") as image:
        image.write(contents)

    # TEMPORARY PREDICTION
    # Actual AI model will be connected later.

    disease = "Leaf Blight"
    confidence = 87.5
    severity = "Medium"

    recommendation = (
        "Monitor the affected crop and consult "
        "an agriculture expert for appropriate treatment."
    )

    return {
        "success": True,
        "image": filename,
        "prediction": {
            "disease": disease,
            "confidence": confidence,
            "severity": severity,
            "recommendation": recommendation
        }
    }

# ---------------------------------------
# SAVE DISEASE REPORT
# ---------------------------------------

@app.post("/reports")
def save_report(
    farmer_id: int,
    image_name: str,
    disease: str,
    confidence: float,
    severity: str,
    recommendation: str
):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO disease_reports
        (farmer_id, image_name, disease, confidence, severity, recommendation)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        farmer_id,
        image_name,
        disease,
        confidence,
        severity,
        recommendation
    ))

    connection.commit()

    report_id = cursor.lastrowid

    connection.close()

    return {
        "message": "Disease report saved successfully",
        "report_id": report_id
    }

# ---------------------------------------
# GET ALL DISEASE REPORTS
# ---------------------------------------

@app.get("/reports")
def get_reports():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM disease_reports
        ORDER BY created_at DESC
    """)

    reports = cursor.fetchall()

    connection.close()

    result = []

    for report in reports:

        result.append({
            "id": report["id"],
            "farmer_id": report["farmer_id"],
            "image_name": report["image_name"],
            "disease": report["disease"],
            "confidence": report["confidence"],
            "severity": report["severity"],
            "recommendation": report["recommendation"],
            "created_at": report["created_at"]
        })

    return result

# ---------------------------------------
# ADD DISEASE INFORMATION
# ---------------------------------------

@app.post("/diseases")
def create_disease(
    disease_name: str,
    crop: str,
    symptoms: str = "",
    severity: str = "",
    prevention: str = "",
    treatment: str = ""
):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO diseases
        (disease_name, crop, symptoms, severity, prevention, treatment)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        disease_name,
        crop,
        symptoms,
        severity,
        prevention,
        treatment
    ))

    connection.commit()

    disease_id = cursor.lastrowid

    connection.close()

    return {
        "message": "Disease information added successfully",
        "disease_id": disease_id
    }


# ---------------------------------------
# GET ALL DISEASES
# ---------------------------------------

@app.get("/diseases")
def get_diseases():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM diseases
        ORDER BY id
    """)

    diseases = cursor.fetchall()

    connection.close()

    result = []

    for disease in diseases:

        result.append({
            "id": disease["id"],
            "disease_name": disease["disease_name"],
            "crop": disease["crop"],
            "symptoms": disease["symptoms"],
            "severity": disease["severity"],
            "prevention": disease["prevention"],
            "treatment": disease["treatment"]
        })

    return result


# ---------------------------------------
# GET ONE DISEASE
# ---------------------------------------

@app.get("/diseases/{disease_id}")
def get_disease(disease_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT * FROM diseases WHERE id = ?",
        (disease_id,)
    )

    disease = cursor.fetchone()

    connection.close()

    if disease is None:
        raise HTTPException(
            status_code=404,
            detail="Disease not found"
        )

    return {
        "id": disease["id"],
        "disease_name": disease["disease_name"],
        "crop": disease["crop"],
        "symptoms": disease["symptoms"],
        "severity": disease["severity"],
        "prevention": disease["prevention"],
        "treatment": disease["treatment"]
    }

# ---------------------------------------
# GET FARMER DISEASE HISTORY
# ---------------------------------------

@app.get("/farmers/{farmer_id}/reports")
def get_farmer_reports(farmer_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    # Check whether farmer exists
    cursor.execute(
        "SELECT id FROM farmers WHERE id = ?",
        (farmer_id,)
    )

    farmer = cursor.fetchone()

    if farmer is None:
        connection.close()

        raise HTTPException(
            status_code=404,
            detail="Farmer not found"
        )

    # Get all reports of this farmer
    cursor.execute("""
        SELECT *
        FROM disease_reports
        WHERE farmer_id = ?
        ORDER BY created_at DESC
    """, (farmer_id,))

    reports = cursor.fetchall()

    connection.close()

    result = []

    for report in reports:

        result.append({
            "id": report["id"],
            "farmer_id": report["farmer_id"],
            "image_name": report["image_name"],
            "disease": report["disease"],
            "confidence": report["confidence"],
            "severity": report["severity"],
            "recommendation": report["recommendation"],
            "created_at": report["created_at"]
        })

    return result

# ---------------------------------------
# WEATHER API
# ---------------------------------------

@app.get("/weather")
def get_weather(latitude: float, longitude: float):

    api_key = os.getenv("OPENWEATHER_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="OpenWeather API key is missing"
        )

    url = "https://api.openweathermap.org/data/2.5/weather"

    params = {
        "lat": latitude,
        "lon": longitude,
        "appid": api_key,
        "units": "metric"
    }

    response = requests.get(url, params=params)


    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=response.json()
    )

    data = response.json()

    return {
        "location": data.get("name"),
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "weather": data["weather"][0]["description"],
        "wind_speed": data["wind"]["speed"]
    }

# ---------------------------------------
# ADD CROP
# ---------------------------------------

@app.post("/crops")
def create_crop(
    farmer_id: int,
    crop_name: str,
    variety: str = "",
    planting_date: str = "",
    location: str = ""
):

    connection = get_connection()
    cursor = connection.cursor()

    # Check whether farmer exists
    cursor.execute(
        "SELECT id FROM farmers WHERE id = ?",
        (farmer_id,)
    )

    farmer = cursor.fetchone()

    if farmer is None:
        connection.close()

        raise HTTPException(
            status_code=404,
            detail="Farmer not found"
        )

    cursor.execute("""
        INSERT INTO crops
        (farmer_id, crop_name, variety, planting_date, location)
        VALUES (?, ?, ?, ?, ?)
    """, (
        farmer_id,
        crop_name,
        variety,
        planting_date,
        location
    ))

    connection.commit()

    crop_id = cursor.lastrowid

    connection.close()

    return {
        "message": "Crop added successfully",
        "crop_id": crop_id
    }


# ---------------------------------------
# GET ALL CROPS
# ---------------------------------------

@app.get("/crops")
def get_crops():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM crops
        ORDER BY id
    """)

    crops = cursor.fetchall()

    connection.close()

    result = []

    for crop in crops:

        result.append({
            "id": crop["id"],
            "farmer_id": crop["farmer_id"],
            "crop_name": crop["crop_name"],
            "variety": crop["variety"],
            "planting_date": crop["planting_date"],
            "location": crop["location"]
        })

    return result


# ---------------------------------------
# GET ONE CROP
# ---------------------------------------

@app.get("/crops/{crop_id}")
def get_crop(crop_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT * FROM crops WHERE id = ?",
        (crop_id,)
    )

    crop = cursor.fetchone()

    connection.close()

    if crop is None:
        raise HTTPException(
            status_code=404,
            detail="Crop not found"
        )

    return {
        "id": crop["id"],
        "farmer_id": crop["farmer_id"],
        "crop_name": crop["crop_name"],
        "variety": crop["variety"],
        "planting_date": crop["planting_date"],
        "location": crop["location"]
    }


# ---------------------------------------
# GET FARMER CROPS
# ---------------------------------------

@app.get("/farmers/{farmer_id}/crops")
def get_farmer_crops(farmer_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    # Check farmer
    cursor.execute(
        "SELECT id FROM farmers WHERE id = ?",
        (farmer_id,)
    )

    farmer = cursor.fetchone()

    if farmer is None:
        connection.close()

        raise HTTPException(
            status_code=404,
            detail="Farmer not found"
        )

    cursor.execute("""
        SELECT * FROM crops
        WHERE farmer_id = ?
        ORDER BY id
    """, (farmer_id,))

    crops = cursor.fetchall()

    connection.close()

    result = []

    for crop in crops:

        result.append({
            "id": crop["id"],
            "farmer_id": crop["farmer_id"],
            "crop_name": crop["crop_name"],
            "variety": crop["variety"],
            "planting_date": crop["planting_date"],
            "location": crop["location"]
        })

    return result

# ---------------------------------------
# CROP HEALTH RISK ASSESSMENT
# ---------------------------------------

@app.get("/risk-assessment")
def risk_assessment(
    crop: str,
    disease: str,
    temperature: float,
    humidity: float
):

    risk_score = 0

    # Disease increases the risk
    if disease.lower() != "healthy":
        risk_score += 2

    # High humidity increases fungal disease risk
    if humidity >= 80:
        risk_score += 2
    elif humidity >= 60:
        risk_score += 1

    # Temperature conditions
    if 20 <= temperature <= 30:
        risk_score += 1

    # Determine risk level
    if risk_score >= 4:
        risk_level = "HIGH"
    elif risk_score >= 2:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    return {
        "crop": crop,
        "disease": disease,
        "temperature": temperature,
        "humidity": humidity,
        "risk_score": risk_score,
        "risk_level": risk_level
    }
# ---------------------------------------
# SAVE WEATHER DATA
# ---------------------------------------

@app.post("/weather/save")
def save_weather(
    farmer_id: int,
    crop_id: int,
    latitude: float,
    longitude: float,
    temperature: float,
    humidity: float,
    weather_condition: str,
    wind_speed: float
):

    connection = get_connection()
    cursor = connection.cursor()

    # Check farmer
    cursor.execute(
        "SELECT id FROM farmers WHERE id = ?",
        (farmer_id,)
    )

    farmer = cursor.fetchone()

    if farmer is None:
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Farmer not found"
        )

    # Check crop and make sure it belongs to this farmer
    cursor.execute(
        "SELECT id FROM crops WHERE id = ? AND farmer_id = ?",
        (crop_id, farmer_id)
    )

    crop = cursor.fetchone()

    if crop is None:
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Crop not found for this farmer"
        )

    # Save weather
    cursor.execute("""
        INSERT INTO weather_data
        (
            farmer_id,
            crop_id,
            latitude,
            longitude,
            temperature,
            humidity,
            weather_condition,
            wind_speed
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        farmer_id,
        crop_id,
        latitude,
        longitude,
        temperature,
        humidity,
        weather_condition,
        wind_speed
    ))

    connection.commit()

    weather_id = cursor.lastrowid

    connection.close()

    return {
        "message": "Weather data saved successfully",
        "weather_id": weather_id
    }

# ---------------------------------------
# GET FARMER WEATHER HISTORY
# ---------------------------------------

@app.get("/weather/farmers/{farmer_id}")
def get_farmer_weather(farmer_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    # Check farmer
    cursor.execute(
        "SELECT id FROM farmers WHERE id = ?",
        (farmer_id,)
    )

    farmer = cursor.fetchone()

    if farmer is None:
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Farmer not found"
        )

    # Get weather history
    cursor.execute("""
        SELECT *
        FROM weather_data
        WHERE farmer_id = ?
        ORDER BY recorded_at DESC
    """, (farmer_id,))

    weather_records = cursor.fetchall()

    connection.close()

    result = []

    for weather in weather_records:

        result.append({
            "id": weather["id"],
            "farmer_id": weather["farmer_id"],
            "crop_id": weather["crop_id"],
            "latitude": weather["latitude"],
            "longitude": weather["longitude"],
            "temperature": weather["temperature"],
            "humidity": weather["humidity"],
            "weather_condition": weather["weather_condition"],
            "wind_speed": weather["wind_speed"],
            "recorded_at": weather["recorded_at"]
        })

    return result

# ---------------------------------------
# ADD AGRICULTURE EXPERT
# ---------------------------------------

@app.post("/experts")
def create_expert(
    name: str,
    organization: str = "",
    specialization: str = "",
    phone: str = "",
    email: str = "",
    location: str = ""
):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO experts
        (name, organization, specialization, phone, email, location)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        name,
        organization,
        specialization,
        phone,
        email,
        location
    ))

    connection.commit()

    expert_id = cursor.lastrowid

    connection.close()

    return {
        "message": "Expert added successfully",
        "expert_id": expert_id
    }


# ---------------------------------------
# GET ALL EXPERTS
# ---------------------------------------

@app.get("/experts")
def get_experts():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM experts
        ORDER BY id
    """)

    experts = cursor.fetchall()

    connection.close()

    result = []

    for expert in experts:

        result.append({
            "id": expert["id"],
            "name": expert["name"],
            "organization": expert["organization"],
            "specialization": expert["specialization"],
            "phone": expert["phone"],
            "email": expert["email"],
            "location": expert["location"]
        })

    return result


# ---------------------------------------
# GET ONE EXPERT
# ---------------------------------------

@app.get("/experts/{expert_id}")
def get_expert(expert_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT * FROM experts WHERE id = ?",
        (expert_id,)
    )

    expert = cursor.fetchone()

    connection.close()

    if expert is None:
        raise HTTPException(
            status_code=404,
            detail="Expert not found"
        )

    return {
        "id": expert["id"],
        "name": expert["name"],
        "organization": expert["organization"],
        "specialization": expert["specialization"],
        "phone": expert["phone"],
        "email": expert["email"],
        "location": expert["location"]
    }
# ---------------------------------------
# ADD FOLLOW-UP / CROP MONITORING RECORD
# ---------------------------------------

@app.post("/follow-ups")
def create_follow_up(
    farmer_id: int,
    crop_id: int,
    health_status: str,
    disease_report_id: int = None,
    notes: str = "",
    follow_up_date: str = ""
):

    connection = get_connection()
    cursor = connection.cursor()

    # Check farmer
    cursor.execute(
        "SELECT id FROM farmers WHERE id = ?",
        (farmer_id,)
    )

    farmer = cursor.fetchone()

    if farmer is None:
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Farmer not found"
        )

    # Check crop belongs to farmer
    cursor.execute(
        "SELECT id FROM crops WHERE id = ? AND farmer_id = ?",
        (crop_id, farmer_id)
    )

    crop = cursor.fetchone()

    if crop is None:
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Crop not found for this farmer"
        )

    # If a disease report is provided, check it exists
    if disease_report_id is not None:

        cursor.execute(
            "SELECT id FROM disease_reports WHERE id = ?",
            (disease_report_id,)
        )

        report = cursor.fetchone()

        if report is None:
            connection.close()
            raise HTTPException(
                status_code=404,
                detail="Disease report not found"
            )

    # Save follow-up
    cursor.execute("""
        INSERT INTO follow_ups
        (
            farmer_id,
            crop_id,
            disease_report_id,
            health_status,
            notes,
            follow_up_date
        )
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        farmer_id,
        crop_id,
        disease_report_id,
        health_status,
        notes,
        follow_up_date
    ))

    connection.commit()

    follow_up_id = cursor.lastrowid

    connection.close()

    return {
        "message": "Follow-up record added successfully",
        "follow_up_id": follow_up_id
    }

# ---------------------------------------
# GET FOLLOW-UP HISTORY FOR A CROP
# ---------------------------------------

@app.get("/crops/{crop_id}/follow-ups")
def get_crop_follow_ups(crop_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            id,
            farmer_id,
            crop_id,
            disease_report_id,
            health_status,
            notes,
            follow_up_date
        FROM follow_ups
        WHERE crop_id = ?
        ORDER BY id DESC
    """, (crop_id,))

    follow_ups = cursor.fetchall()

    connection.close()

    return [
        {
            "follow_up_id": row[0],
            "farmer_id": row[1],
            "crop_id": row[2],
            "disease_report_id": row[3],
            "health_status": row[4],
            "notes": row[5],
            "follow_up_date": row[6]
        }
        for row in follow_ups
    ]

# ---------------------------------------
# ADD PEST OBSERVATION
# ---------------------------------------

@app.post("/pest-observations")
def create_pest_observation(
    farmer_id: int,
    crop_id: int,
    pest_name: str,
    pest_count: int = 0,
    detection_method: str = "Manual",
    observation_date: str = "",
    notes: str = ""
):

    connection = get_connection()
    cursor = connection.cursor()

    # Check farmer
    cursor.execute(
        "SELECT id FROM farmers WHERE id = ?",
        (farmer_id,)
    )

    farmer = cursor.fetchone()

    if farmer is None:
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Farmer not found"
        )

    # Check crop belongs to farmer
    cursor.execute(
        "SELECT id FROM crops WHERE id = ? AND farmer_id = ?",
        (crop_id, farmer_id)
    )

    crop = cursor.fetchone()

    if crop is None:
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Crop not found for this farmer"
        )

    # Save pest observation
    cursor.execute("""
        INSERT INTO pest_observations
        (
            farmer_id,
            crop_id,
            pest_name,
            pest_count,
            detection_method,
            observation_date,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        farmer_id,
        crop_id,
        pest_name,
        pest_count,
        detection_method,
        observation_date,
        notes
    ))

    connection.commit()

    observation_id = cursor.lastrowid

    connection.close()

    return {
        "message": "Pest observation added successfully",
        "observation_id": observation_id
    }

# ---------------------------------------
# GET PEST OBSERVATION HISTORY FOR A CROP
# ---------------------------------------

@app.get("/crops/{crop_id}/pest-observations")
def get_crop_pest_observations(crop_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            id,
            farmer_id,
            crop_id,
            pest_name,
            pest_count,
            detection_method,
            observation_date,
            notes
        FROM pest_observations
        WHERE crop_id = ?
        ORDER BY id DESC
    """, (crop_id,))

    observations = cursor.fetchall()

    connection.close()

    return [
        {
            "observation_id": row[0],
            "farmer_id": row[1],
            "crop_id": row[2],
            "pest_name": row[3],
            "pest_count": row[4],
            "detection_method": row[5],
            "observation_date": row[6],
            "notes": row[7]
        }
        for row in observations
    ]

# ---------------------------------------
# CREATE EXPERT / LAB REFERRAL
# ---------------------------------------

@app.post("/referrals")
def create_referral(
    farmer_id: int,
    disease_report_id: int,
    expert_id: int,
    referral_reason: str = "",
    referral_date: str = ""
):

    connection = get_connection()
    cursor = connection.cursor()

    # Check farmer
    cursor.execute(
        "SELECT id FROM farmers WHERE id = ?",
        (farmer_id,)
    )

    farmer = cursor.fetchone()

    if farmer is None:
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Farmer not found"
        )

    # Check disease report
    cursor.execute(
        """
        SELECT id FROM disease_reports
        WHERE id = ? AND farmer_id = ?
        """,
        (disease_report_id, farmer_id)
    )

    report = cursor.fetchone()

    if report is None:
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Disease report not found for this farmer"
        )

    # Check expert
    cursor.execute(
        "SELECT id FROM experts WHERE id = ?",
        (expert_id,)
    )

    expert = cursor.fetchone()

    if expert is None:
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Expert not found"
        )

    # Create referral
    cursor.execute("""
        INSERT INTO referrals
        (
            farmer_id,
            disease_report_id,
            expert_id,
            referral_reason,
            status,
            referral_date
        )
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        farmer_id,
        disease_report_id,
        expert_id,
        referral_reason,
        "Pending",
        referral_date
    ))

    connection.commit()

    referral_id = cursor.lastrowid

    connection.close()

    return {
        "message": "Referral created successfully",
        "referral_id": referral_id,
        "status": "Pending"
    }

# ---------------------------------------
# CREATE EXPERT / LAB REFERRAL
# ---------------------------------------

@app.post("/referrals")
def create_referral(
    farmer_id: int,
    disease_report_id: int,
    expert_id: int,
    referral_reason: str = "",
    referral_date: str = ""
):

    connection = get_connection()
    cursor = connection.cursor()

    # Check farmer
    cursor.execute(
        "SELECT id FROM farmers WHERE id = ?",
        (farmer_id,)
    )

    farmer = cursor.fetchone()

    if farmer is None:
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Farmer not found"
        )

    # Check disease report
    cursor.execute(
        """
        SELECT id FROM disease_reports
        WHERE id = ? AND farmer_id = ?
        """,
        (disease_report_id, farmer_id)
    )

    report = cursor.fetchone()

    if report is None:
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Disease report not found for this farmer"
        )

    # Check expert
    cursor.execute(
        "SELECT id FROM experts WHERE id = ?",
        (expert_id,)
    )

    expert = cursor.fetchone()

    if expert is None:
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Expert not found"
        )

    # Create referral
    cursor.execute("""
        INSERT INTO referrals
        (
            farmer_id,
            disease_report_id,
            expert_id,
            referral_reason,
            status,
            referral_date
        )
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        farmer_id,
        disease_report_id,
        expert_id,
        referral_reason,
        "Pending",
        referral_date
    ))

    connection.commit()

    referral_id = cursor.lastrowid

    connection.close()

    return {
        "message": "Referral created successfully",
        "referral_id": referral_id,
        "status": "Pending"
    }
# ---------------------------------------
# GET REFERRALS FOR A FARMER
# ---------------------------------------

@app.get("/farmers/{farmer_id}/referrals")
def get_farmer_referrals(farmer_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    # Check farmer
    cursor.execute(
        "SELECT id FROM farmers WHERE id = ?",
        (farmer_id,)
    )

    farmer = cursor.fetchone()

    if farmer is None:
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Farmer not found"
        )

    # Get referrals
    cursor.execute("""
        SELECT
            r.id,
            r.disease_report_id,
            r.expert_id,
            e.name,
            e.organization,
            r.referral_reason,
            r.status,
            r.referral_date,
            r.expert_response
        FROM referrals r
        JOIN experts e ON r.expert_id = e.id
        WHERE r.farmer_id = ?
        ORDER BY r.id DESC
    """, (farmer_id,))

    referrals = cursor.fetchall()

    connection.close()

    return [
        {
            "referral_id": row[0],
            "disease_report_id": row[1],
            "expert_id": row[2],
            "expert_name": row[3],
            "organization": row[4],
            "referral_reason": row[5],
            "status": row[6],
            "referral_date": row[7],
            "expert_response": row[8]
        }
        for row in referrals
    ]