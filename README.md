# Hệ thống quản lý đặt phòng khách sạn

Ứng dụng web quản lý đặt phòng khách sạn với React frontend và Node.js backend.

## Tính năng

- 🔐 Đăng nhập/Đăng xuất với JWT
- 🏨 Quản lý phòng (thêm, sửa, xóa)
- 📅 Quản lý đặt phòng (xem, xác nhận, hủy)
- 👨‍💼 Giao diện admin
- 📱 Responsive design

## Công nghệ sử dụng

### Frontend
- React 19
- React Router DOM
- Axios
- Material-UI
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- bcryptjs

## Cài đặt và chạy local

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Deployment lên Render

### 1. Chuẩn bị MongoDB Atlas

1. Tạo tài khoản MongoDB Atlas: https://cloud.mongodb.com
2. Tạo cluster mới (Free tier)
3. Tạo database user
4. Lấy connection string

### 2. Deploy Backend

1. Push code lên GitHub
2. Tạo Web Service trên Render
3. Connect với GitHub repository
4. Cấu hình:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `MONGODB_URI`: MongoDB Atlas connection string
     - `JWT_SECRET`: Secret key cho JWT (tạo ngẫu nhiên)

### 3. Deploy Frontend

1. Tạo Static Site trên Render
2. Connect với GitHub repository
3. Cấu hình:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Environment Variables**:
     - `REACT_APP_API_URL`: URL của backend (ví dụ: https://your-backend.onrender.com)

### 4. Tạo Admin User

Sau khi deploy backend, chạy script tạo admin:

```bash
# Local
cd backend
npm run create-admin

# Hoặc trên Render, thêm vào build command:
npm install && npm run create-admin && npm start
```

**Thông tin đăng nhập mặc định:**
- Username: `admin`
- Password: `admin123`

## Cấu trúc thư mục

```
QLDATPHONG/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy thông tin user

### Rooms (sẽ phát triển)
- `GET /api/rooms` - Lấy danh sách phòng
- `POST /api/rooms` - Tạo phòng mới
- `PUT /api/rooms/:id` - Cập nhật phòng
- `DELETE /api/rooms/:id` - Xóa phòng

### Bookings (sẽ phát triển)
- `GET /api/bookings` - Lấy danh sách đặt phòng
- `POST /api/bookings` - Tạo đặt phòng mới
- `PUT /api/bookings/:id` - Cập nhật đặt phòng
- `DELETE /api/bookings/:id` - Xóa đặt phòng

## Tác giả

Hệ thống quản lý đặt phòng khách sạn - Dự án thực tập tốt nghiệp
