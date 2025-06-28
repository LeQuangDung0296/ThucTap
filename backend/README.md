# Hotel Management Backend API

Backend API cho hệ thống quản lý khách sạn với Node.js, Express và MongoDB.

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` từ `env.example`:
```bash
cp env.example .env
```

3. Cấu hình MongoDB và JWT_SECRET trong file `.env`

4. Chạy server:
```bash
# Development
npm run dev

# Production
npm start
```

5. Tạo dữ liệu mẫu (tùy chọn):
```bash
# Tạo admin user
npm run create-admin

# Tạo phòng mẫu
npm run create-rooms
```

## API Endpoints

### Authentication

#### Đăng ký
- **POST** `/api/auth/register`
- **Body:**
```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyễn Văn A"
}
```

#### Đăng nhập
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "username": "user123",
  "password": "password123"
}
```

#### Lấy thông tin user hiện tại
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`

#### Đăng xuất
- **POST** `/api/auth/logout`

### Room Management

#### Lấy danh sách phòng
- **GET** `/api/rooms`
- **Query params:** `status`, `roomType`, `minPrice`, `maxPrice`, `floor`, `page`, `limit`

#### Lấy phòng có sẵn
- **GET** `/api/rooms/available`
- **Query params:** `checkIn`, `checkOut`, `roomType`, `guests`

#### Lấy thông tin phòng
- **GET** `/api/rooms/:id`

#### Tạo phòng mới (Admin only)
- **POST** `/api/rooms`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "roomNumber": "101",
  "roomType": "single",
  "capacity": 1,
  "price": 500000,
  "description": "Phòng đơn tiện nghi cơ bản",
  "amenities": ["WiFi", "TV", "Điều hòa"],
  "floor": 1
}
```

#### Cập nhật phòng (Admin only)
- **PUT** `/api/rooms/:id`
- **Headers:** `Authorization: Bearer <token>`

#### Xóa phòng (Admin only)
- **DELETE** `/api/rooms/:id`
- **Headers:** `Authorization: Bearer <token>`

#### Cập nhật trạng thái phòng (Admin only)
- **PATCH** `/api/rooms/:id/status`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "status": "maintenance"
}
```

### Booking Management

#### Tạo booking mới
- **POST** `/api/bookings`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "roomId": "room_id_here",
  "checkIn": "2024-01-15",
  "checkOut": "2024-01-17",
  "guests": {
    "adults": 2,
    "children": 1
  },
  "specialRequests": "Gần thang máy",
  "contactInfo": {
    "phone": "0123456789",
    "email": "user@example.com"
  }
}
```

#### Lấy booking của user
- **GET** `/api/bookings/my-bookings`
- **Headers:** `Authorization: Bearer <token>`
- **Query params:** `status`, `page`, `limit`

#### Lấy thông tin booking
- **GET** `/api/bookings/my-bookings/:id`
- **Headers:** `Authorization: Bearer <token>`

#### Hủy booking
- **POST** `/api/bookings/:id/cancel`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "reason": "Thay đổi kế hoạch"
}
```

#### Lấy tất cả booking (Admin only)
- **GET** `/api/bookings`
- **Headers:** `Authorization: Bearer <token>`
- **Query params:** `status`, `userId`, `roomId`, `startDate`, `endDate`, `page`, `limit`

#### Thống kê booking (Admin only)
- **GET** `/api/bookings/stats`
- **Headers:** `Authorization: Bearer <token>`
- **Query params:** `startDate`, `endDate`

#### Cập nhật trạng thái booking (Admin only)
- **PATCH** `/api/bookings/:id/status`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "status": "confirmed",
  "notes": "Đã xác nhận booking"
}
```

## Kiểm thử với Postman

### 1. Test Server đang chạy
- **Method:** GET
- **URL:** `http://localhost:5000/`

### 2. Đăng ký tài khoản mới
- **Method:** POST
- **URL:** `http://localhost:5000/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "123456",
  "fullName": "Test User"
}
```

### 3. Đăng nhập
- **Method:** POST
- **URL:** `http://localhost:5000/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "username": "testuser",
  "password": "123456"
}
```

### 4. Lấy danh sách phòng
- **Method:** GET
- **URL:** `http://localhost:5000/api/rooms`

### 5. Tạo booking
- **Method:** POST
- **URL:** `http://localhost:5000/api/bookings`
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **Body (raw JSON):**
```json
{
  "roomId": "room_id_from_step_4",
  "checkIn": "2024-01-15",
  "checkOut": "2024-01-17",
  "guests": {
    "adults": 2,
    "children": 0
  },
  "contactInfo": {
    "phone": "0123456789",
    "email": "test@example.com"
  }
}
```

## Triển khai trên Render

1. Push code lên GitHub
2. Tạo Web Service trên Render
3. Cấu hình biến môi trường:
   - `MONGODB_URI`: Connection string MongoDB
   - `JWT_SECRET`: Secret key cho JWT
   - `PORT`: Port (Render sẽ tự động set)
4. Deploy

## Cấu trúc Project

```
backend/
├── controllers/
│   ├── authController.js
│   ├── roomController.js
│   └── bookingController.js
├── models/
│   ├── User.js
│   ├── rooms.js
│   └── Booking.js
├── routes/
│   ├── auth.js
│   ├── rooms.js
│   └── bookings.js
├── scripts/
│   ├── createAdminUser.js
│   └── createSampleRooms.js
├── server.js
├── package.json
└── .env
```

## Database Schema

### User
- username, email, password, fullName, role, isActive, lastLogin

### Room
- roomNumber, roomType, capacity, price, description, amenities, status, floor, isActive

### Booking
- user, room, checkIn, checkOut, guests, totalPrice, status, paymentStatus, specialRequests, contactInfo 