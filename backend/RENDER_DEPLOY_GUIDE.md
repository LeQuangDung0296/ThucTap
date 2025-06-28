# Hướng dẫn Deploy Backend lên Render

## Bước 1: Chuẩn bị MongoDB Atlas

### 1.1 Tạo MongoDB Atlas Cluster
1. Truy cập [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Đăng ký tài khoản hoặc đăng nhập
3. Tạo cluster mới (Free tier)
4. Chọn cloud provider và region gần nhất

### 1.2 Cấu hình Database Access
1. Vào "Database Access" trong menu bên trái
2. Click "Add New Database User"
3. Tạo username và password mạnh
4. Chọn "Read and write to any database"
5. Click "Add User"

### 1.3 Cấu hình Network Access
1. Vào "Network Access" trong menu bên trái
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.4 Lấy Connection String
1. Vào "Database" trong menu bên trái
2. Click "Connect"
3. Chọn "Connect your application"
4. Copy connection string
5. Thay thế `<password>` bằng password đã tạo
6. Thay thế `<dbname>` bằng `hotel_management`

## Bước 2: Push Code lên GitHub

### 2.1 Khởi tạo Git (nếu chưa có)
```bash
cd backend
git init
git add .
git commit -m "Initial commit: Hotel Management Backend"
```

### 2.2 Kết nối với GitHub
```bash
git remote add origin https://github.com/LeQuangDung0296/ThucTap.git
git branch -M main
git push -u origin main
```

## Bước 3: Deploy lên Render

### 3.1 Tạo tài khoản Render
1. Truy cập [Render.com](https://render.com)
2. Đăng ký tài khoản (có thể dùng GitHub)

### 3.2 Tạo Web Service
1. Click "New" → "Web Service"
2. Kết nối với GitHub repository
3. Chọn repository `LeQuangDung0296/ThucTap`

### 3.3 Cấu hình Web Service
- **Name:** `hotel-management-backend`
- **Root Directory:** `backend` (nếu code ở thư mục backend)
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** `Free`

### 3.4 Cấu hình Environment Variables
Click "Environment" và thêm các biến:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/hotel_management?retryWrites=true&w=majority` |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-this-in-production` |

**Lưu ý:** 
- Thay `username:password` bằng thông tin MongoDB Atlas
- Tạo JWT_SECRET mạnh (có thể dùng: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)

### 3.5 Deploy
1. Click "Create Web Service"
2. Render sẽ tự động build và deploy
3. Chờ quá trình hoàn tất (có thể mất 5-10 phút)

## Bước 4: Kiểm tra Deploy

### 4.1 Test API trên Render
Sử dụng Postman với URL mới:
- **Base URL:** `https://your-app-name.onrender.com`
- **Test endpoint:** `GET https://your-app-name.onrender.com/`

### 4.2 Test các API
1. **Đăng ký:** `POST https://your-app-name.onrender.com/api/auth/register`
2. **Đăng nhập:** `POST https://your-app-name.onrender.com/api/auth/login`
3. **Lấy thông tin user:** `GET https://your-app-name.onrender.com/api/auth/me`

## Bước 5: Tạo Admin User (Tùy chọn)

### 5.1 Chạy script tạo admin
```bash
# Local
npm run create-admin

# Hoặc trên Render (qua console)
node scripts/createAdminUser.js
```

### 5.2 Thông tin admin mặc định
- **Username:** `admin`
- **Password:** `admin123`
- **Email:** `admin@hotel.com`

## Troubleshooting

### Lỗi thường gặp

#### 1. Build failed
- Kiểm tra `package.json` có đúng không
- Kiểm tra dependencies có thiếu không

#### 2. MongoDB connection failed
- Kiểm tra MONGODB_URI có đúng không
- Kiểm tra Network Access trên MongoDB Atlas
- Kiểm tra username/password

#### 3. JWT_SECRET not set
- Đảm bảo đã set JWT_SECRET trong Environment Variables

#### 4. Port binding error
- Render sẽ tự động set PORT, không cần lo lắng

### Logs và Debug
1. Vào Web Service trên Render
2. Click tab "Logs" để xem log
3. Click "Manual Deploy" để deploy lại nếu cần

## Cập nhật Code
Mỗi khi push code mới lên GitHub, Render sẽ tự động deploy lại.

```bash
git add .
git commit -m "Update: description"
git push origin main
``` 