# 🚀 Quick Start - Ứng Dụng Thể Dục

## ⚡ Bắt Đầu Nhanh (5 Phút)

### 1️⃣ Cài Đặt & Chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run start:dev

# Hoặc không dùng mock (nếu có backend)
npm run start:no-mock
```

### 2️⃣ Truy Cập Ứng Dụng

```
http://localhost:8000
→ Menu → Ứng Dụng Thể Dục → Chọn tính năng
```

### 3️⃣ Các Tính Năng Chính

| # | Tính Năng | URL | Mô Tả |
|-|-|-|-|
| 1️⃣ | Dashboard | `/fitness/dashboard` | Tổng quan tiến độ |
| 2️⃣ | Nhật Ký Tập | `/fitness/workout-journal` | Quản lý buổi tập |
| 3️⃣ | Chỉ Số Sức Khỏe | `/fitness/health-metrics` | BMI & chỉ số sức khỏe |
| 4️⃣ | Mục Tiêu | `/fitness/goals` | Quản lý mục tiêu cá nhân |
| 5️⃣ | Bài Tập | `/fitness/exercise-library` | Thư viện bài tập |

## 📖 Hướng Dẫn Sử Dụng Nhanh

### 🏃 Thêm Buổi Tập Mới

**Bước 1**: Vào _Nhật Ký Tập Luyện_

**Bước 2**: Nhấn _Thêm buổi tập_

**Bước 3**: Điền thông tin:
```
Ngày tập        : 15/05/2024
Loại bài tập    : Cardio
Thời lượng       : 45 (phút)
Calo đốt         : 450 (kcal)
Ghi chú          : Chạy bộ công viên
Trạng thái       : Hoàn thành
```

**Bước 4**: Nhấn _OK_

### 📊 Thêm Chỉ Số Sức Khỏe

**Bước 1**: Vào _Nhật Ký Chỉ Số Sức Khỏe_

**Bước 2**: Nhấn _Thêm chỉ số sức khỏe_

**Bước 3**: Điền thông tin:
```
Ngày                    : 15/05/2024
Cân nặng                : 70 (kg)
Chiều cao               : 175 (cm)
Nhịp tim lúc nghỉ       : 65 (bpm)
Giờ ngủ                 : 7.5 (giờ)
```

**Bước 4**: Nhấn _OK_ (BMI tự động tính: 22.9 - Bình thường)

### 🎯 Tạo Mục Tiêu

**Bước 1**: Vào _Quản Lý Mục Tiêu_

**Bước 2**: Nhấn _Thêm mục tiêu mới_

**Bước 3**: Điền trong Drawer:
```
Tên mục tiêu     : Giảm cân 5kg
Loại mục tiêu    : Giảm cân
Giá trị mục tiêu : 65 (kg)
Giá trị hiện tại : 70 (kg)
Hạn chót         : 15/08/2024
Trạng thái       : Đang thực hiện
```

**Bước 4**: Nhấn _Lưu_

### 📚 Duyệt Thư Viện Bài Tập

**Bước 1**: Vào _Thư Viện Bài Tập_

**Bước 2**: Sử dụng bộ lọc:
```
Tìm kiếm  : "Chạy" hoặc "Yoga"
Nhóm cơ   : Full Body / Chest / etc.
Mức độ    : Easy / Medium / Hard
```

**Bước 3**: Nhấn vào card để xem chi tiết

**Bước 4**: Lựa chọn hành động:
- 📖 Xem hướng dẫn chi tiết
- ✏️ Sửa bài tập
- 🗑️ Xóa bài tập

## 🎨 Giao Diện

### Dashboard
```
┌─────────────────────────────────────┐
│  📊 Dashboard - Tổng Quan           │
├─────────────────────────────────────┤
│  [Buổi tập]  [Calo]  [Streak]  [%]  │
├─────────────────────────────────────┤
│  [📊 Biểu đồ cột]  [📈 Biểu đồ đường]│
├─────────────────────────────────────┤
│  ⏱️ 5 Buổi tập gần nhất (Timeline)   │
└─────────────────────────────────────┘
```

### Nhật Ký Tập Luyện
```
┌────────────────────────────────────┐
│  🔍 Tìm | 🏷️  Loại | 📅 Ngày      │
├────────────────────────────────────┤
│  [Ngày] [Bài] [Thời] [Calo] [...]  │
│  15/05  Cardio  45   450   Hoàn    │
│  14/05  Yoga    60   200   Bỏ lỡ   │
└────────────────────────────────────┘
```

### Quản Lý Mục Tiêu
```
┌──────────────┬──────────────┐
│ Mục tiêu 1   │ Mục tiêu 2   │
│ ████░░ 70%   │ ██░░░░░ 30%  │
│ Hạn: 08/2024 │ Hạn: 12/2024 │
└──────────────┴──────────────┘
```

### Thư Viện Bài Tập
```
┌──────────┬──────────┬──────────┐
│ Chạy bộ  │ Yoga     │ Nâng tạ  │
│ 🏃 600kc │ 🧘 200kc │ 💪 400kc │
│ Dễ       │ Dễ       │ Khó      │
└──────────┴──────────┴──────────┘
```

## 🔄 Quy Trình Điển Hình (1 Tuần)

### Thứ Hai
```
✅ Vào Dashboard xem tổng quan
✅ Thêm buổi tập: Chạy bộ 45 phút, 450 kcal
✅ Ghi chỉ số: Cân nặng 70kg, Ngủ 7 giờ
```

### Thứ Ba - Thứ Năm
```
✅ Thêm buổi tập khác nhau (Cardio/Strength/Yoga)
✅ Cập nhật giá trị mục tiêu nếu có thay đổi
```

### Thứ Sáu
```
✅ Xem Dashboard để đánh giá tuần
✅ Kiểm tra progress trên mục tiêu
```

### Cuối Tuần
```
✅ Đánh giá toàn tuần
✅ Kế hoạch cho tuần tiếp theo
✅ Sửa mục tiêu nếu cần thiết
```

## 💡 Mẹo & Thủ Thuật

### 🎯 Sử Dụng Hiệu Quả

1. **Nhập dữ liệu đều đặn**
   - Mỗi ngày sau khi tập
   - Cùng thời điểm mỗi sáng

2. **Đặt mục tiêu thực tế**
   - Giảm 0.5-1kg/tuần là hợp lý
   - Tập 3-4 buổi/tuần

3. **Sử dụng Timeline**
   - Xem các buổi tập gần nhất
   - Theo dõi streak của bạn

4. **Lọc dữ liệu**
   - Lọc theo loại bài tập
   - Xem tiến độ trong khoảng thời gian

### 🔧 Keyboard Shortcuts

| Shortcut | Hành động |
|----------|-----------|
| Tab | Di chuyển giữa fields |
| Enter | Submit form |
| Esc | Đóng modal/drawer |

### 📱 Responsive

- **Desktop**: Full width, 3 cột
- **Tablet**: 2 cột layout
- **Mobile**: 1 cột, full responsive

## ❓ Câu Hỏi Thường Gặp

**Q: BMI tính thế nào?**
```
A: BMI = Cân nặng (kg) / (Chiều cao (m))²
Ví dụ: 70 / (1.75)² = 22.9
```

**Q: Làm sao tính Progress?**
```
A: Progress = (Current / Target) × 100
Ví dụ: (70 / 65) × 100 = 92.3%
```

**Q: Dữ liệu lưu ở đâu?**
```
A: Hiện tại lưu trong memory (mock)
Khi production, lưu trên server backend
```

**Q: Có thể xuất dữ liệu không?**
```
A: Chưa có tính năng export
Sẽ thêm vào version tiếp theo
```

## 🐛 Troubleshooting

### Vấn đề: Trang không tải
```
✅ Clear browser cache (Ctrl+Shift+Delete)
✅ Reload trang (F5)
✅ Kiểm tra console (F12) xem có error
```

### Vấn đề: Dữ liệu không lưu
```
✅ Kiểm tra network tab
✅ Xem có error message không
✅ Thử lại lần nữa
```

### Vấn đề: BMI không tính
```
✅ Nhập cả cân nặng và chiều cao
✅ Kiểm tra số nhập có đúng không
✅ Nhấn OK để lưu
```

## 📚 Tài Liệu Thêm

- 📖 [FITNESS_APP_README.md](./FITNESS_APP_README.md) - Tài liệu đầy đủ
- 👨‍💻 [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Hướng dẫn phát triển

## 🎓 Học Thêm

### Ant Design Components
- [Button](https://ant.design/components/button/)
- [Form](https://ant.design/components/form/)
- [Table](https://ant.design/components/table/)
- [Card](https://ant.design/components/card/)

### React Hooks
- [useState](https://react.dev/reference/react/useState)
- [useEffect](https://react.dev/reference/react/useEffect)
- [useCallback](https://react.dev/reference/react/useCallback)

### TypeScript
- [Official Docs](https://www.typescriptlang.org/docs/)
- [React + TS](https://react.dev/learn/typescript)

---

**Bắt đầu ngay bây giờ! 💪**

```bash
npm run start:dev
```

Rồi truy cập: http://localhost:8000/fitness/dashboard
