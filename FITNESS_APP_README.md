# 🏋️ Ứng Dụng Thể Dục - Theo Dõi Sức Khỏe

## 📋 Tổng Quan

Ứng dụng Thể Dục là một giải pháp quản lý toàn diện cho việc theo dõi hoạt động thể dục, chỉ số sức khỏe, mục tiêu cá nhân và thư viện bài tập. Ứng dụng được xây dựng bằng React, Ant Design và TypeScript.

## ✨ Các Tính Năng Chính

### 1. 📊 Dashboard
**Đường dẫn**: `/fitness/dashboard`

Dashboard cung cấp cái nhìn tổng quan về tiến độ tập luyện của bạn:

- **4 Thẻ Chỉ Số Nhanh**:
  - 📅 Tổng buổi tập trong tháng
  - 🔥 Tổng calo đã đốt
  - ⚡ Số ngày tập liên tiếp (Streak)
  - 🎯 Mục tiêu hoàn thành (%)

- **Biểu Đồ Cột**: Hiển thị số buổi tập theo từng tuần trong tháng
- **Biểu Đồ Đường**: Thể hiện sự thay đổi cân nặng theo thời gian
- **Timeline**: Danh sách 5 buổi tập gần nhất với chi tiết ngày tháng, loại bài tập, thời gian, calo và trạng thái

### 2. 📝 Nhật Ký Tập Luyện
**Đường dẫn**: `/fitness/workout-journal`

Quản lý chi tiết tất cả các buổi tập luyện:

**Bảng Danh Sách** với các cột:
- Ngày
- Loại bài tập (Cardio/Strength/Yoga/HIIT/Other)
- Thời lượng (phút)
- Calo đốt
- Ghi chú
- Trạng thái (Hoàn thành/Bỏ lỡ)

**Tính Năng**:
- 🔍 Tìm kiếm theo tên bài tập
- 🏷️ Lọc theo loại bài tập
- 📅 Lọc theo khoảng thời gian (Range DatePicker)
- ➕ Thêm buổi tập mới qua Modal Form
- ✏️ Sửa buổi tập: Mở Form với dữ liệu cũ
- 🗑️ Xóa buổi tập: Popconfirm xác nhận trước xóa

### 3. 📊 Nhật Ký Chỉ Số Sức Khỏe
**Đường dẫn**: `/fitness/health-metrics`

Ghi lại và quản lý các chỉ số sức khỏe hàng ngày:

**Bảng Danh Sách** với các cột:
- Ngày
- Cân nặng (kg)
- Chiều cao (cm)
- BMI (tự tính) + Tag màu phân loại
- Nhịp tim lúc nghỉ (bpm)
- Giờ ngủ

**Công Thức BMI**:
```
BMI = Cân nặng (kg) / (Chiều cao (m))²
```

**Phân Loại BMI**:
| Phân Loại | Chỉ Số | Màu Tag |
|-----------|--------|---------|
| Thiếu cân | < 18.5 | 🔵 Xanh dương |
| Bình thường | 18.5 – 24.9 | 🟢 Xanh lá |
| Thừa cân | 25 – 29.9 | 🟡 Vàng |
| Béo phì | ≥ 30 | 🔴 Đỏ |

**Tính Năng**:
- ➕ Thêm/Sửa/Xóa chỉ số sức khỏe
- 📅 Lọc theo khoảng thời gian
- 💾 Lưu và tính toán BMI tự động

### 4. 🎯 Quản Lý Mục Tiêu
**Đường dẫn**: `/fitness/goals`

Thiết lập và theo dõi các mục tiêu cá nhân:

**Hiển Thị Dạng Card** với thông tin:
- Tên mục tiêu
- Loại (Giảm cân/Tăng cơ/Cải thiện sức bền/Khác)
- Giá trị mục tiêu
- Giá trị hiện tại
- Progress Bar (% hoàn thành)
- Deadline
- Trạng thái (Đang thực hiện/Đã đạt/Đã hủy)

**Tính Năng**:
- ➕ Thêm mục tiêu qua Drawer Form
- ✏️ Cập nhật giá trị hiện tại trực tiếp (inline) trên Card
- 🗑️ Xóa mục tiêu với Popconfirm xác nhận
- 🏷️ Lọc theo trạng thái dùng Segmented component

### 5. 📚 Thư Viện Bài Tập
**Đường dẫn**: `/fitness/exercise-library`

Quản lý thư viện bài tập toàn diện:

**Hiển Thị Dạng Grid (3 Cột)** với thông tin:
- Tên bài tập
- Nhóm cơ tác động
- Mức độ khó (Tag: Dễ/Trung bình/Khó)
- Mô tả ngắn
- Calo đốt trung bình/giờ

**Tính Năng**:
- 🔍 Tìm kiếm theo tên bài tập
- 🏷️ Lọc theo nhóm cơ (Chest/Back/Legs/Shoulders/Arms/Core/Full Body)
- 📊 Lọc theo mức độ khó
- 📖 Click vào card mở Modal xem chi tiết
- 💬 Chi tiết Modal hiển thị hướng dẫn đầy đủ
- ➕ Thêm/Sửa/Xóa bài tập

**Nhóm Cơ Hỗ Trợ**:
- 🫀 Chest (Ngực)
- 🔄 Back (Lưng)
- 🦵 Legs (Chân)
- 💪 Shoulders (Vai)
- 💪 Arms (Tay)
- 🔁 Core (Lõi)
- 🏃 Full Body (Toàn thân)

## 📁 Cấu Trúc Thư Mục

```
src/
├── models/
│   └── fitness.ts              # Type definitions
├── services/
│   └── fitness.ts              # API services & utilities
├── pages/
│   ├── TheDuc/                 # Dashboard
│   │   ├── index.tsx
│   │   ├── index.less
│   │   └── components/
│   │       ├── WeeklyChart.tsx
│   │       └── WeightChart.tsx
│   ├── NhatKyTapLuyen/         # Workout Journal
│   │   ├── index.tsx
│   │   └── index.less
│   ├── NhatKyChiSo/            # Health Metrics
│   │   ├── index.tsx
│   │   └── index.less
│   ├── QuanLyMucTieu/          # Goal Management
│   │   ├── index.tsx
│   │   └── index.less
│   └── ThuVienBaiTap/          # Exercise Library
│       ├── index.tsx
│       └── index.less
├── mock/
│   ├── fitness.ts              # Mock data generation
│   └── fitness-api.ts          # Mock API endpoints
└── config/
    └── routes.ts               # Route configuration
```

## 🚀 Cách Sử Dụng

### Truy Cập Ứng Dụng

1. Truy cập menu chính, tìm **"Ứng Dụng Thể Dục"**
2. Chọn một trong 5 tính năng chính:
   - Dashboard
   - Nhật Ký Tập Luyện
   - Nhật Ký Chỉ Số Sức Khỏe
   - Quản Lý Mục Tiêu
   - Thư Viện Bài Tập

### Thêm Buổi Tập

1. Vào **Nhật Ký Tập Luyện**
2. Nhấn **"Thêm buổi tập"**
3. Điền thông tin:
   - Ngày tập
   - Loại bài tập (Cardio/Strength/Yoga/HIIT/Other)
   - Thời lượng (phút)
   - Calo đốt
   - Ghi chú
   - Trạng thái (Hoàn thành/Bỏ lỡ)
4. Nhấn **"OK"** để lưu

### Thêm Chỉ Số Sức Khỏe

1. Vào **Nhật Ký Chỉ Số Sức Khỏe**
2. Nhấn **"Thêm chỉ số sức khỏe"**
3. Điền thông tin:
   - Ngày
   - Cân nặng (kg)
   - Chiều cao (cm)
   - Nhịp tim lúc nghỉ (bpm)
   - Giờ ngủ
4. BMI sẽ tự động tính toán
5. Nhấn **"OK"** để lưu

### Thiết Lập Mục Tiêu

1. Vào **Quản Lý Mục Tiêu**
2. Nhấn **"Thêm mục tiêu mới"**
3. Điền thông tin trong Drawer:
   - Tên mục tiêu
   - Loại mục tiêu
   - Giá trị mục tiêu
   - Giá trị hiện tại
   - Hạn chót
   - Trạng thái
4. Nhấn **"Lưu"**
5. Cập nhật tiến độ bằng cách nhấn vào giá trị hiện tại trên card

### Quản Lý Bài Tập

1. Vào **Thư Viện Bài Tập**
2. Sử dụng bộ lọc:
   - Tìm kiếm theo tên
   - Lọc theo nhóm cơ
   - Lọc theo mức độ khó
3. Nhấn vào card để xem chi tiết
4. Nhấn **"Thêm bài tập"** để thêm mới

## 🛠️ Công Nghệ Sử Dụng

- **Frontend Framework**: React 18
- **UI Library**: Ant Design 5
- **Language**: TypeScript
- **State Management**: React Hooks
- **Charts**: Recharts
- **Date Library**: Moment.js
- **Build Tool**: UMI

## 📦 Mock Data

Ứng dụng được tích hợp với mock server để phục vụ dữ liệu test. Các endpoint được defined trong:
- `mock/fitness.ts` - Hàm sinh dữ liệu
- `mock/fitness-api.ts` - API endpoints

Khi chạy với `npm run start:dev` (MOCK=none disabled), dữ liệu sẽ được lưu trong bộ nhớ.

## 🔧 Yêu Cầu Hệ Thống

- Node.js 14+
- npm hoặc yarn
- Trình duyệt hỗ trợ ES6

## 📝 Ghi Chú

- Tất cả dữ liệu được lưu trữ mock (in-memory)
- BMI được tính tự động khi nhập cân nặng và chiều cao
- Progress bar trên goals được tính từ (Current Value / Target Value) * 100
- Tất cả ngày tháng sử dụng format `YYYY-MM-DD`

## 🎨 Giao Diện

- **Responsive Design**: Hỗ trợ desktop, tablet, mobile
- **Dark Mode Compatible**: Tương thích với theme của Ant Design
- **Smooth Animations**: Hiệu ứng chuyển động mượt mà
- **Intuitive UX**: Giao diện dễ sử dụng

## 📞 Hỗ Trợ

Để báo cáo lỗi hoặc yêu cầu tính năng, vui lòng tạo issue trong repository.

---

**Phiên Bản**: 1.0.0  
**Cập nhật**: 2024
