# IoT Realtime Calendar Dashboard using Azure

## 📌 Overview
This project is a web-based dashboard that displays real-time air quality data
using a calendar and interactive charts. The system is built using cloud-native
architecture on Microsoft Azure and consumes public IoT datasets via API.

Users can select a date on the calendar to view environmental data such as
AQI and PM2.5 in real time.

---

## 🎯 Objectives
- Visualize IoT environmental data in real time
- Apply Big Data concepts with time-series data
- Deploy a fully online cloud application
- Use public datasets with clear and verifiable sources

---

## 🏗️ System Architecture

Public IoT Dataset (OpenAQ / WAQI)
        ↓
Azure Functions (Serverless Backend)
        ↓
Frontend Web App (Calendar + Charts)
        ↓
User Browser

- No local server
- No dataset download
- Real-time data processing

---

## 📊 Dataset Information
- Dataset Name: OpenAQ
- Type: Public Open Data
- Source: https://openaq.org/
- Data includes:
  - PM2.5
  - PM10
  - AQI
  - Time-series environmental data
- Access Method: REST API (Real-time)

Detailed dataset description is available in `docs/dataset.md`.

---

## 🧩 Features
- Calendar view to select specific dates
- Real-time data retrieval based on selected date
- Interactive charts displaying hourly data
- Fully deployed online via GitHub and Azure

---

## 🛠️ Technologies Used

### Frontend
- HTML, CSS, JavaScript
- FullCalendar.js
- Chart.js

### Backend
- Azure Functions (Node.js)
- REST API (Real-time data fetching)

### Cloud Platform
- Azure Static Web Apps
- Azure Functions

---

## 🚀 Deployment
This project is deployed using GitHub integration with Azure Static Web Apps.

Deployment steps:
1. Push code to GitHub repository
2. Connect repository to Azure Static Web Apps
3. Azure automatically builds and deploys the application

No local installation is required.

---

## 📁 Project Structure
- `frontend/` : Web UI (calendar and charts)
- `api/` : Azure Functions for real-time data access
- `data-schema/` : Data model definition
- `docs/` : Documentation and dataset references

---

## 👨‍🎓 Academic Purpose
This project is developed for educational purposes to demonstrate:
- IoT data consumption
- Big Data time-series visualization
- Cloud-native application design

---

## 📜 License
This project uses publicly available datasets and is intended for academic use only.
