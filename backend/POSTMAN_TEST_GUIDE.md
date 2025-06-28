# Hướng dẫn Test API bằng Postman

## Cài đặt Postman
1. Tải Postman từ: https://www.postman.com/downloads/
2. Cài đặt và tạo tài khoản

## Tạo Collection mới
1. Mở Postman
2. Click "New" → "Collection"
3. Đặt tên: "Hotel Management API"

## Test các API

### 1. Test Server đang chạy
- **Method:** GET
- **URL:** `http://localhost:5000/`
- **Expected Response:**
```json
{
  "message": "Hotel Management API is running"
}
```

### 2. Đăng ký tài khoản mới
- **Method:** POST
- **URL:** `http://localhost:5000/api/auth/register`
- **Headers:**
  - Key: `Content-Type`
  - Value: `application/json`
- **Body (raw JSON):**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "123456",
  "fullName": "Test User"
}
```
- **Expected Response (201):**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "testuser",
    "email": "test@example.com",
    "role": "user",
    "fullName": "Test User"
  }
}
```

### 3. Đăng nhập
- **Method:** POST
- **URL:** `http://localhost:5000/api/auth/login`
- **Headers:**
  - Key: `Content-Type`
  - Value: `application/json`
- **Body (raw JSON):**
```json
{
  "username": "testuser",
  "password": "123456"
}
```
- **Expected Response (200):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "testuser",
    "email": "test@example.com",
    "role": "user",
    "fullName": "Test User"
  }
}
```

### 4. Lấy thông tin user (cần token)
- **Method:** GET
- **URL:** `http://localhost:5000/api/auth/me`
- **Headers:**
  - Key: `Content-Type`
  - Value: `application/json`
  - Key: `Authorization`
  - Value: `Bearer <token_from_login>`
- **Expected Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "username": "testuser",
    "email": "test@example.com",
    "fullName": "Test User",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Lấy danh sách phòng
- **Method:** GET
- **URL:** `http://localhost:5000/api/rooms`
- **Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "roomNumber": "101",
      "roomType": "single",
      "capacity": 1,
      "price": 500000,
      "status": "available",
      "floor": 1
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "pages": 1
  }
}
```

### 6. Lấy phòng có sẵn
- **Method:** GET
- **URL:** `http://localhost:5000/api/rooms/available?checkIn=2024-01-15&checkOut=2024-01-17&guests=2`
- **Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "roomNumber": "201",
      "roomType": "double",
      "capacity": 2,
      "price": 800000,
      "status": "available"
    }
  ],
  "total": 1
}
```

### 7. Tạo booking mới
- **Method:** POST
- **URL:** `http://localhost:5000/api/bookings`
- **Headers:**
  - Key: `Content-Type`
  - Value: `application/json`
  - Key: `Authorization`
  - Value: `Bearer <token>`
- **Body (raw JSON):**
```json
{
  "roomId": "room_id_from_step_5",
  "checkIn": "2024-01-15",
  "checkOut": "2024-01-17",
  "guests": {
    "adults": 2,
    "children": 0
  },
  "specialRequests": "Gần thang máy",
  "contactInfo": {
    "phone": "0123456789",
    "email": "test@example.com"
  }
}
```
- **Expected Response (201):**
```json
{
  "success": true,
  "message": "Đặt phòng thành công",
  "data": {
    "_id": "...",
    "user": "...",
    "room": {
      "_id": "...",
      "roomNumber": "201",
      "roomType": "double"
    },
    "checkIn": "2024-01-15T00:00:00.000Z",
    "checkOut": "2024-01-17T00:00:00.000Z",
    "totalPrice": 1600000,
    "status": "pending"
  }
}
```

### 8. Lấy booking của user
- **Method:** GET
- **URL:** `http://localhost:5000/api/bookings/my-bookings`
- **Headers:**
  - Key: `Authorization`
  - Value: `Bearer <token>`
- **Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "room": {
        "roomNumber": "201",
        "roomType": "double"
      },
      "checkIn": "2024-01-15T00:00:00.000Z",
      "checkOut": "2024-01-17T00:00:00.000Z",
      "totalPrice": 1600000,
      "status": "pending"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

### 9. Hủy booking
- **Method:** POST
- **URL:** `http://localhost:5000/api/bookings/<booking_id>/cancel`
- **Headers:**
  - Key: `Content-Type`
  - Value: `application/json`
  - Key: `Authorization`
  - Value: `Bearer <token>`
- **Body (raw JSON):**
```json
{
  "reason": "Thay đổi kế hoạch"
}
```
- **Expected Response (200):**
```json
{
  "success": true,
  "message": "Hủy booking thành công",
  "data": {
    "status": "cancelled",
    "cancelledAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Test Admin APIs

### 10. Đăng nhập admin
- **Method:** POST
- **URL:** `http://localhost:5000/api/auth/login`
- **Body (raw JSON):**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

### 11. Tạo phòng mới (Admin only)
- **Method:** POST
- **URL:** `http://localhost:5000/api/rooms`
- **Headers:**
  - Key: `Content-Type`
  - Value: `application/json`
  - Key: `Authorization`
  - Value: `Bearer <admin_token>`
- **Body (raw JSON):**
```json
{
  "roomNumber": "501",
  "roomType": "suite",
  "capacity": 3,
  "price": 1200000,
  "description": "Phòng suite cao cấp",
  "amenities": ["WiFi", "TV", "Điều hòa", "Mini bar"],
  "floor": 5
}
```

### 12. Cập nhật trạng thái phòng (Admin only)
- **Method:** PATCH
- **URL:** `http://localhost:5000/api/rooms/<room_id>/status`
- **Headers:**
  - Key: `Content-Type`
  - Value: `application/json`
  - Key: `Authorization`
  - Value: `Bearer <admin_token>`
- **Body (raw JSON):**
```json
{
  "status": "maintenance"
}
```

### 13. Lấy tất cả booking (Admin only)
- **Method:** GET
- **URL:** `http://localhost:5000/api/bookings`
- **Headers:**
  - Key: `Authorization`
  - Value: `Bearer <admin_token>`

### 14. Cập nhật trạng thái booking (Admin only)
- **Method:** PATCH
- **URL:** `http://localhost:5000/api/bookings/<booking_id>/status`
- **Headers:**
  - Key: `Content-Type`
  - Value: `application/json`
  - Key: `Authorization`
  - Value: `Bearer <admin_token>`
- **Body (raw JSON):**
```json
{
  "status": "confirmed",
  "notes": "Đã xác nhận booking"
}
```

## Lưu Token tự động
1. Trong request đăng nhập, vào tab "Tests"
2. Thêm script:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.token);
}
```
3. Trong request cần token, sử dụng: `Bearer {{token}}`

## Test trên Render (sau khi deploy)
Thay đổi URL từ `http://localhost:5000` thành URL của Render:
- `https://your-app-name.onrender.com`

## Các trường hợp test khác

### Error Cases
- Đăng ký với username đã tồn tại
- Đăng ký với email đã tồn tại
- Đăng ký với password quá ngắn
- Đăng nhập sai mật khẩu
- Truy cập protected route không có token
- Truy cập admin route với user thường
- Tạo booking với phòng không có sẵn
- Tạo booking trùng thời gian
- Hủy booking không thể hủy
- Cập nhật phòng với số phòng đã tồn tại

### Success Cases
- Tìm kiếm phòng theo loại
- Lọc phòng theo giá
- Phân trang danh sách phòng
- Thống kê booking
- Lọc booking theo trạng thái
- Tìm kiếm booking theo ngày 