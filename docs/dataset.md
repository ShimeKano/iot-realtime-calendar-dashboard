# Dataset Description

## 1. Dataset Name
**OpenAQ – Open Air Quality Data Platform**

---

## 2. Dataset Type
- Public Open Dataset
- IoT Environmental Data
- Time-series data (theo thời gian)

---

## 3. Data Provider & Source
- Provider: **OpenAQ**
- Official Website: https://openaq.org/
- API Documentation: https://docs.openaq.org/
- License: Open Data (free for academic and non-commercial use)

OpenAQ is a global platform that aggregates air quality measurements from
governmental and research-grade monitoring stations around the world.
The dataset is widely used in scientific research and environmental analysis.

---

## 4. Data Description
The dataset contains air quality measurements collected from IoT sensors and
monitoring stations, including:

- PM2.5 (Particulate Matter ≤ 2.5µm)
- PM10 (Particulate Matter ≤ 10µm)
- Air Quality Index (AQI)
- Timestamp (date and hour)
- Location (city / monitoring station)

The data is updated continuously and represents real-time environmental conditions.

---

## 5. Time Characteristics
- Data type: Time-series
- Granularity: Hourly measurements
- Coverage: Historical and real-time data
- Time zone: UTC (converted to local time in application if needed)

---

## 6. Data Access Method
The dataset is accessed **in real time** using the official OpenAQ REST API.

Example access method:
GET https://api.openaq.org/v2/measurements


Query parameters include:
- Date range (from – to)
- Location / city
- Measurement type (PM2.5, PM10, etc.)

---

## 7. Dataset Usage in This Project
This project **does not download or store the entire dataset locally**.

Instead:
- The frontend sends a selected date to the backend
- Azure Functions query the OpenAQ API in real time
- The returned data is processed and sent directly to the web application
- Charts and calendar views are rendered dynamically

This approach follows **cloud-native and real-time data processing principles**.

---

## 8. Big Data Consideration
Although the application retrieves data on demand, the dataset qualifies as
Big Data due to:
- Large global scale
- High frequency (hourly updates)
- Long-term historical records
- Continuous data generation from IoT sensors

The project demonstrates Big Data concepts through time-based querying and
real-time visualization.

---

## 9. Data Schema (Simplified)
The processed data used in this project follows the schema below:

```json
{
  "date": "YYYY-MM-DD",
  "hour": 0,
  "pm25": 0,
  "pm10": 0,
  "aqi": 0
}
