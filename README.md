# 📊 Hệ thống giám sát chất lượng không khí theo thời gian thực (AQI Big Data Time‑Series)

## 🧠 Tên đề tài

**Xây dựng hệ thống giám sát và phân tích chất lượng không khí theo thời gian thực sử dụng Big Data và Cloud Computing**

(English subtitle)

> *Real‑time Air Quality Monitoring and Big Data Time‑Series Analysis using Cloud Computing*

---

## 📌 Giới thiệu

Ô nhiễm không khí đang là một trong những vấn đề môi trường nghiêm trọng tại các đô thị lớn. Việc theo dõi chất lượng không khí theo thời gian thực và lưu trữ dữ liệu dài hạn giúp:

* Phân tích xu hướng ô nhiễm
* Đánh giá mức độ ảnh hưởng theo thời gian
* Hỗ trợ ra quyết định và nghiên cứu môi trường

Đề tài này xây dựng một **hệ thống giám sát AQI (Air Quality Index)** hoạt động trên nền tảng **Cloud**, thu thập dữ liệu theo thời gian thực và lưu trữ dưới dạng **Big Data Time‑Series** để trực quan hóa và phân tích.

---

## 🎯 Mục tiêu đề tài

* Thu thập dữ liệu chất lượng không khí (AQI, PM2.5, nhiệt độ, độ ẩm…)
* Lưu trữ dữ liệu liên tục theo thời gian (time‑series)
* Trực quan hóa dữ liệu bằng biểu đồ theo giờ / ngày / nhiều ngày
* Ứng dụng công nghệ **Cloud Computing & Big Data** vào bài toán thực tế

---

## 🏗️ Kiến trúc hệ thống

```
[AQICN API]
      ↓
[Azure Function - Realtime Fetch]
      ↓
[Azure Table Storage (Big Data Time‑Series)]
      ↓
[Azure Static Web App - Frontend]
      ↓
[Chart.js Dashboard]
```

---

## 🧩 Công nghệ sử dụng

### ☁️ Cloud & Backend

* **Azure Static Web Apps**
* **Azure Functions (Node.js)**
* **Azure Table Storage** (Time‑Series Big Data)

### 🌐 Frontend

* HTML / CSS / JavaScript
* **Chart.js** (vẽ biểu đồ dữ liệu theo thời gian)

### 🌍 Nguồn dữ liệu

* **AQICN – World Air Quality Index Project**

  * Website: [https://aqicn.org](https://aqicn.org)
  * API: [https://api.waqi.info](https://api.waqi.info)

---

## 📊 Các loại dữ liệu thu thập

* AQI (Air Quality Index)
* PM2.5
* Nhiệt độ
* Độ ẩm
* Áp suất
* Gió
* Thời gian đo (timestamp)

Dữ liệu được lưu liên tục theo thời gian → **Big Data Time‑Series**

---

## 🖥️ Giao diện hệ thống

🔗 **Website demo:**
[https://agreeable-river-0990df500.6.azurestaticapps.net/](https://agreeable-river-0990df500.6.azurestaticapps.net/)

### Chức năng chính:

* Xem AQI theo thời gian thực
* Xem lịch sử dữ liệu theo ngày hoặc nhiều ngày
* Chọn khung thời gian: 1 giờ, 24 giờ, 7 ngày, 1 tháng
* Biểu đồ trực quan (line chart) với giao diện hiện đại
* Tự động cập nhật dữ liệu mỗi 5 phút

---

## 🚀 Hướng dẫn sử dụng

### 1️⃣ Truy cập website

Mở link demo ở trên bằng trình duyệt.

### 2️⃣ Xem dữ liệu realtime

Hệ thống tự động gọi API để lấy dữ liệu AQI tại vị trí đã cấu hình.

### 3️⃣ Xem lịch sử dữ liệu

* Chọn ngày cần xem
* Chọn loại dữ liệu (AQI / PM2.5 / Nhiệt độ / Độ ẩm)
* Biểu đồ sẽ hiển thị dữ liệu theo thời gian

### 4️⃣ Sử dụng bộ chọn khung thời gian

Bộ chọn **Khung thời gian** nằm trên thanh điều khiển với 4 tùy chọn:

| Tùy chọn | Mô tả |
|----------|-------|
| **1 giờ** | Hiển thị dữ liệu trong 1 giờ gần nhất (hôm nay) hoặc 1 giờ cuối cùng của ngày đã chọn. Nhãn trục X: HH:mm |
| **24 giờ** | Hiển thị dữ liệu trong 24 giờ gần nhất (hôm nay) hoặc toàn bộ ngày đã chọn. Nhãn trục X: HH:mm |
| **7 ngày** | Tự động tải dữ liệu 7 ngày liên tiếp tính từ ngày đã chọn, gộp tất cả bản ghi và sắp xếp theo thời gian. Nhãn trục X: DD/MM |
| **1 tháng** | Tự động tải dữ liệu 30 ngày liên tiếp tính từ ngày đã chọn. Nhãn trục X: DD/MM |

> **Lưu ý:**
> - Với **1 giờ** và **24 giờ**: ô chọn ngày xác định ngày cụ thể cần xem. Để xem hôm nay, để mặc định hoặc chọn ngày hiện tại.
> - Với **7 ngày** và **1 tháng**: ô chọn ngày xác định ngày kết thúc của khoảng thời gian.
> - Nếu chưa có dữ liệu, biểu đồ sẽ hiển thị placeholder (đường trống) và thông báo bằng tiếng Việt.
> - Dữ liệu tự động làm mới mỗi **5 phút**.

---

## 📈 Ý nghĩa Big Data trong đề tài

* Dữ liệu được thu thập **liên tục theo thời gian**
* Lưu trữ số lượng lớn bản ghi (time‑series)
* Có thể mở rộng để phân tích xu hướng dài hạn
* Phù hợp với mô hình IoT & Smart City

---

## 🔮 Hướng phát triển

* Thu thập dữ liệu từ nhiều vị trí
* Phân tích & dự đoán AQI
* Cảnh báo khi AQI vượt ngưỡng
* Lưu trữ dữ liệu dài hạn (months / years)

---

## 👨‍🎓 Thông tin sinh viên

* **Họ tên:** Nguyễn Quốc Tuấn(ShimeKano)
* **MSSV:** 22004249
* **Môn học:** Phân Tích Dữ liệu lớn trong IoT

---

## ✅ Kết luận

Đề tài đã xây dựng thành công một hệ thống giám sát chất lượng không khí theo thời gian thực, ứng dụng công nghệ **Cloud Computing và Big Data**, đáp ứng yêu cầu học thuật và có tính thực tiễn cao.

---

> *"From real‑time data to Big Data insights"* 🌍📊
