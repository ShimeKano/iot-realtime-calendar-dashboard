# IoT Realtime Calendar Dashboard (Azure)

## 📌 Giới thiệu
**IoT Realtime Calendar Dashboard** là một ứng dụng web hiển thị dữ liệu chất lượng không khí
(AQI, PM2.5, nhiệt độ, độ ẩm, áp suất…) theo **thời gian thực**, kết hợp với **lịch và biểu đồ trực quan**.

Hệ thống được xây dựng theo kiến trúc **Cloud-native** trên nền tảng **Microsoft Azure**,
khai thác dữ liệu từ **nguồn dữ liệu IoT công khai** thông qua API, không cần tải dataset về máy.

👉 Website demo (online):  
**https://agreeable-river-0990df500.6.azurestaticapps.net/**

---

## 🎯 Mục tiêu của đề tài
- Ứng dụng dữ liệu IoT môi trường theo thời gian thực
- Minh họa khái niệm **Big Data – Time-series data**
- Xây dựng hệ thống **Serverless + Cloud**
- Trực quan hóa dữ liệu bằng lịch và biểu đồ
- Triển khai hoàn chỉnh một hệ thống online

---

## 🏗️ Kiến trúc hệ thống

Nguồn dữ liệu IoT công khai (AQICN)
↓
Azure Functions (Serverless API)
↓
Frontend Web (Calendar + Charts)
↓
Trình duyệt người dùng


**Đặc điểm:**
- Không sử dụng server truyền thống
- Không lưu trữ dataset cục bộ
- Dữ liệu được lấy theo thời gian thực qua REST API

---

## 📊 Nguồn dữ liệu (Dataset)

### 🔹 Dataset chính
- **Tên**: World Air Quality Index (AQICN)
- **Loại**: Public IoT Open Data
- **Website**: https://aqicn.org/
- **Hình thức truy cập**: REST API (Realtime)

### 🔹 Dữ liệu bao gồm
- AQI (Air Quality Index)
- PM2.5
- Nhiệt độ (Temperature)
- Độ ẩm (Humidity)
- Áp suất (Pressure)
- Gió (Wind speed, gust)

> ⚠️ Lưu ý học thuật:  
> Dữ liệu được truy xuất **theo thời gian thực tại thời điểm người dùng truy cập**.  
> Các biểu đồ theo ngày được xây dựng nhằm **minh họa cách tổ chức và trực quan hóa dữ liệu time-series** trong Big Data, không phải hệ thống lưu trữ lịch sử dài hạn.

---

## 🧩 Chức năng chính
- Hiển thị lịch để chọn ngày quan sát
- Lấy dữ liệu môi trường theo vị trí (tọa độ)
- Hiển thị AQI và các chỉ số môi trường
- Biểu đồ trực quan (Chart.js)
- Ứng dụng chạy hoàn toàn online

---

## 🛠️ Công nghệ sử dụng

### Frontend
- HTML, CSS, JavaScript
- FullCalendar.js
- Chart.js

### Backend
- Azure Functions (Node.js)
- REST API (AQICN)

### Cloud
- Azure Static Web Apps
- Azure Functions (Serverless)

---

## 🚀 Triển khai (Deployment)
Hệ thống được deploy tự động bằng **GitHub + Azure Static Web Apps**:

1. Push source code lên GitHub
2. Kết nối repository với Azure Static Web Apps
3. Azure tự động build và deploy

➡️ Người dùng chỉ cần trình duyệt, **không cần cài đặt gì thêm**.

---

## 📁 Cấu trúc thư mục

iot-realtime-calendar-dashboard/
│
├── frontend/ # Giao diện web
├── api/ # Azure Functions (Realtime API)
├── data-schema/ # Mô hình dữ liệu
├── docs/ # Tài liệu mô tả
└── README.md


---

## 👨‍🎓 Mục đích học thuật
Đề tài được thực hiện nhằm phục vụ:
- Môn học IoT / Big Data / Cloud Computing
- Minh họa cách tiêu thụ dữ liệu IoT thời gian thực
- Thiết kế hệ thống web hiện đại theo kiến trúc Serverless

---

## 📜 Bản quyền & sử dụng
- Sử dụng dữ liệu công khai từ AQICN
- Chỉ phục vụ mục đích học tập và nghiên cứu
- Không sử dụng cho mục đích thương mại
