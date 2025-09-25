<div align="center">
  
  <h1>🚀 LC Blog – Your Daily Tech Insight</h1>
  
  <p>
    <a href="https://lcblog.great-site.net" target="_blank"><b>Truy cập trang</b></a>
  </p>
  
  <p>
    <img alt="Visitors" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.countapi.xyz%2Fget%2Flcblog.great-site.net%2Fvisitors&query=%24.value&label=Visitors&color=4f46e5">
    <img alt="Build" src="https://img.shields.io/badge/build-vite%206-blue">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-green">
  </p>
  
  <p>Khám phá những bài viết mới nhất về công nghệ, lập trình và hơn thế nữa.</p>
</div>

## ✨ Tính năng chính

- 📝 **Quản lý bài viết**: Tạo, chỉnh sửa, xóa bài viết
- 👥 **Hệ thống người dùng**: Đăng ký, đăng nhập, quản lý profile
- 💬 **Bình luận**: Tương tác với bài viết qua bình luận
- ❤️ **Lưu bài viết**: Lưu các bài viết yêu thích
- 🔍 **Tìm kiếm & Lọc**: Tìm kiếm nâng cao với bộ lọc
- 📊 **Dashboard**: Giao diện quản trị cho admin và user
- 🎨 **Responsive Design**: Giao diện đẹp với Tailwind CSS
- 🌙 **Dark/Light Mode**: Chế độ sáng/tối với theme toggle
- 📱 **Mobile Optimized**: Tối ưu cho thiết bị di động
- 🚀 **Loading Animations**: Hiệu ứng loading mượt mà
- 📄 **Pagination**: Phân trang cho danh sách bài viết
- 🔗 **Social Sharing**: Chia sẻ bài viết lên mạng xã hội
- 📊 **Reading Progress**: Thanh tiến độ đọc bài viết
- ⌨️ **Keyboard Shortcuts**: Phím tắt để điều hướng nhanh
- 🤖 **AI Integration**: Tích hợp Google Gemini AI (tùy chọn)

## 🛠️ Cài đặt và chạy ứng dụng

### Yêu cầu hệ thống
- **Node.js** (phiên bản 18 trở lên)
- **npm** hoặc **yarn**
- **Git** (để clone repository)

### Bước 1: Cài đặt Node.js

#### Cách 1: Tải từ trang chính thức (Khuyến nghị)
1. Truy cập: https://nodejs.org/
2. Tải xuống phiên bản **LTS** (Long Term Support)
3. Chạy file installer và làm theo hướng dẫn
4. Khởi động lại Command Prompt/PowerShell

#### Cách 2: Sử dụng winget (Windows)
```powershell
winget install OpenJS.NodeJS --accept-source-agreements --accept-package-agreements
```

#### Cách 3: Sử dụng Chocolatey (nếu đã cài)
```powershell
choco install nodejs
```

### Bước 2: Kiểm tra cài đặt
```bash
node --version
npm --version
```

### Bước 3: Clone và cài đặt dependencies
```bash
# Clone repository (nếu chưa có)
git clone <repository-url>
cd LC

# Cài đặt dependencies
npm install
```

### Bước 4: Cấu hình môi trường (Tùy chọn)
Tạo file `.env.local` trong thư mục gốc:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Bước 5: Chạy ứng dụng

#### Cách 1: Chạy bình thường (nếu npm hoạt động)
```bash
npm run dev
```

#### Cách 2: Chạy với npm.cmd (khi gặp lỗi execution policy)
```bash
npm.cmd run dev
```

#### Cách 3: Chạy với đường dẫn đầy đủ (khi npm không được nhận diện)
```powershell
# Thêm Node.js vào PATH
$env:PATH += ";C:\Program Files\nodejs"

# Sau đó chạy
npm run dev
```

#### Cách 4: Chạy trực tiếp với đường dẫn đầy đủ
```powershell
& "C:\Program Files\nodejs\npm.cmd" run dev
```

Ứng dụng sẽ chạy tại: **http://localhost:3000**

## ⚡ Quick Start - Chạy nhanh

Nếu đã cài đặt Node.js, chỉ cần chạy các lệnh sau:

```powershell
# 1. Thêm Node.js vào PATH (nếu cần)
$env:PATH += ";C:\Program Files\nodejs"

# 2. Cài đặt dependencies (chỉ cần chạy 1 lần)
npm.cmd install

# 3. Chạy ứng dụng
npm.cmd run dev
```

**Hoặc chạy trực tiếp:**
```powershell
& "C:\Program Files\nodejs\npm.cmd" run dev
```

## 🚀 Scripts có sẵn

- `npm run dev` - Chạy development server
- `npm run build` - Build ứng dụng cho production
- `npm run preview` - Xem trước build production

## 📁 Cấu trúc dự án

```
LC/
├── components/          # Các component UI
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── PostCard.tsx
│   └── ...
├── pages/              # Các trang của ứng dụng
│   ├── auth/           # Trang đăng nhập/đăng ký
│   ├── Admin.tsx
│   ├── UserDashboard.tsx
│   └── ...
├── types.ts            # Định nghĩa TypeScript types
├── constants.ts        # Dữ liệu mẫu
├── App.tsx            # Component chính
├── index.html         # File HTML chính
├── vite.config.ts     # Cấu hình Vite
└── package.json       # Dependencies và scripts
```

## 🎯 Cách sử dụng

### Tài khoản mặc định
- **Admin**: `AdminLC` / `adminpassword`
- **User**: `UserTech` / `userpassword`

### Tính năng chính
1. **Xem bài viết**: Trang chủ hiển thị các bài viết mới nhất
2. **Đăng nhập**: Sử dụng tài khoản mặc định hoặc tạo mới
3. **Tạo bài viết**: Đăng nhập và sử dụng dashboard
4. **Quản lý**: Admin có thể quản lý tất cả bài viết và người dùng

### ⌨️ Keyboard Shortcuts
- `Ctrl/Cmd + H`: Về trang chủ
- `Ctrl/Cmd + P`: Trang bài viết
- `Ctrl/Cmd + A`: Trang giới thiệu
- `Ctrl/Cmd + C`: Trang liên hệ
- `Ctrl/Cmd + K`: Chuyển đổi chế độ sáng/tối
- `Esc`: Đóng menu/dropdown

## 📋 Các lệnh đã test thành công

### Cài đặt Node.js
```powershell
# Cài đặt Node.js bằng winget
winget install OpenJS.NodeJS --accept-source-agreements --accept-package-agreements
```

### Kiểm tra cài đặt
```powershell
# Kiểm tra Node.js
& "C:\Program Files\nodejs\node.exe" --version

# Kiểm tra npm
& "C:\Program Files\nodejs\npm.cmd" --version
```

### Cài đặt dependencies
```powershell
# Cài đặt packages
& "C:\Program Files\nodejs\npm.cmd" install
```

### Chạy ứng dụng
```powershell
# Cách 1: Thêm vào PATH rồi chạy
$env:PATH += ";C:\Program Files\nodejs"
npm.cmd run dev

# Cách 2: Chạy trực tiếp
& "C:\Program Files\nodejs\npm.cmd" run dev
```

### Kiểm tra server
```powershell
# Kiểm tra port 3000
netstat -an | findstr :3000
```

## 🔧 Xử lý sự cố

### Lỗi "npm is not recognized"
```powershell
# Thêm Node.js vào PATH
$env:PATH += ";C:\Program Files\nodejs"

# Hoặc sử dụng đường dẫn đầy đủ
& "C:\Program Files\nodejs\npm.cmd" install
```

### Lỗi Execution Policy (PowerShell)
```powershell
# Chạy với quyền admin
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port 3000 đã được sử dụng
```bash
# Thay đổi port trong vite.config.ts
server: {
  port: 3001  // hoặc port khác
}
```

## 📝 Ghi chú

- Ứng dụng sử dụng **localStorage** để lưu trữ dữ liệu tạm thời
- Dữ liệu sẽ bị mất khi xóa browser data
- Để sử dụng tính năng AI, cần cấu hình `GEMINI_API_KEY`
- Ứng dụng được build với **Vite** và **React 19**

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

---

### 👀 Bộ đếm người xem (không tăng khi xem lại)

Badge “Visitors” ở trên đọc số liệu từ CountAPI (chế độ chỉ đọc), nên tự thân việc mở README sẽ không làm tăng lượt xem. Để tăng lượt xem chỉ 1 lần cho mỗi trình duyệt, hãy thêm đoạn script dưới đây vào website (đã deploy trên `lcblog.great-site.net`). Đoạn này đảm bảo mỗi trình duyệt chỉ cộng 1 lần nhờ `localStorage`:

```html
<script>
  (function uniqueViewOnce(){
    try {
      const KEY = 'lcblog_unique_view_v1';
      if (localStorage.getItem(KEY)) return; // đã tính trước đó
      fetch('https://api.countapi.xyz/hit/lcblog.great-site.net/visitors?amount=1')
        .then(() => localStorage.setItem(KEY, '1'))
        .catch(() => {});
    } catch(_) {}
  })();
  // Badge trên README lấy số bằng:
  // https://api.countapi.xyz/get/lcblog.great-site.net/visitors
</script>
```

Ghi chú:
- Nếu deploy vào domain khác, đổi cả 2 URL `countapi` cho phù hợp (namespace/key tuỳ ý).
- Nếu cần reset số đếm, tạo key mới (ví dụ `visitors_v2`) rồi đổi trong README và script.
