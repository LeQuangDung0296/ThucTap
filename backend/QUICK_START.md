# Quick Start Guide - Hotel Management Backend

## 🚀 Bắt đầu nhanh

### 1. Cài đặt và chạy local
```bash
cd backend
npm install
cp env.example .env
# Chỉnh sửa .env với MongoDB URI và JWT_SECRET
npm run dev
```

### 2. Test với Postman
1. Mở Postman
2. Test server: `GET http://localhost:5000/`
3. Đăng ký: `POST http://localhost:5000/api/auth/register`
4. Đăng nhập: `POST http://localhost:5000/api/auth/login`

### 3. Deploy lên Render
1. Push code lên GitHub
2. Tạo MongoDB Atlas cluster
3. Tạo Web Service trên Render
4. Cấu hình Environment Variables
5. Deploy và test

## 📋 Checklist

### Local Development
- [ ] Cài đặt Node.js và npm
- [ ] Clone repository
- [ ] Cài đặt dependencies: `npm install`
- [ ] Tạo file `.env` từ `env.example`
- [ ] Cấu hình MongoDB URI và JWT_SECRET
- [ ] Chạy server: `npm run dev`
- [ ] Test API với Postman

### MongoDB Atlas
- [ ] Tạo tài khoản MongoDB Atlas
- [ ] Tạo cluster mới
- [ ] Cấu hình Database Access
- [ ] Cấu hình Network Access (0.0.0.0/0)
- [ ] Lấy connection string

### GitHub
- [ ] Tạo repository trên GitHub
- [ ] Push code lên GitHub
- [ ] Kiểm tra code đã được push

### Render Deployment
- [ ] Tạo tài khoản Render
- [ ] Tạo Web Service
- [ ] Kết nối với GitHub repository
- [ ] Cấu hình Environment Variables
- [ ] Deploy
- [ ] Test API trên Render

## 🔧 Cấu hình Environment Variables

### Local (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hotel_management
JWT_SECRET=your-secret-key
```

### Render
- `NODE_ENV`: `production`
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secret key cho JWT

## 📝 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Test server | No |
| POST | `/api/auth/register` | Đăng ký | No |
| POST | `/api/auth/login` | Đăng nhập | No |
| GET | `/api/auth/me` | Lấy thông tin user | Yes |
| POST | `/api/auth/logout` | Đăng xuất | No |

## 🧪 Test Cases

### Happy Path
- [ ] Đăng ký tài khoản mới
- [ ] Đăng nhập với tài khoản vừa tạo
- [ ] Lấy thông tin user với token
- [ ] Đăng xuất

### Error Cases
- [ ] Đăng ký với username đã tồn tại
- [ ] Đăng ký với email đã tồn tại
- [ ] Đăng ký với password quá ngắn
- [ ] Đăng nhập sai mật khẩu
- [ ] Truy cập protected route không có token
- [ ] Truy cập protected route với token không hợp lệ

## 📚 Tài liệu tham khảo

- [POSTMAN_TEST_GUIDE.md](./POSTMAN_TEST_GUIDE.md) - Hướng dẫn test chi tiết
- [RENDER_DEPLOY_GUIDE.md](./RENDER_DEPLOY_GUIDE.md) - Hướng dẫn deploy
- [README.md](./README.md) - Tài liệu tổng quan

## 🆘 Troubleshooting

### Lỗi thường gặp
1. **MongoDB connection failed**: Kiểm tra MONGODB_URI và Network Access
2. **JWT_SECRET not set**: Đảm bảo đã set trong Environment Variables
3. **Port already in use**: Thay đổi PORT trong .env
4. **Build failed on Render**: Kiểm tra package.json và dependencies

### Liên hệ hỗ trợ
Nếu gặp vấn đề, hãy kiểm tra:
1. Logs trong terminal (local)
2. Logs trong Render dashboard
3. Network tab trong browser developer tools 