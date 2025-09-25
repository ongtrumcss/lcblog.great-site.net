import { Post, PostCategory, User, UserActivity, Comment } from './types';

export const USERS: User[] = [
  { id: 1, username: 'AdminLC', password: 'adminpassword', role: 'admin', registeredDate: '20/07/2024', avatarUrl: 'https://picsum.photos/seed/admin-avatar/100/100' },
  { id: 2, username: 'UserTech', password: 'userpassword', role: 'user', registeredDate: '21/07/2024', avatarUrl: 'https://picsum.photos/seed/user-avatar/100/100' },
  { id: 3, username: 'LeTrongChien', password: 'password123', role: 'user', registeredDate: '25/09/2024', avatarUrl: 'https://picsum.photos/seed/letrongchien/100/100' },
];

export const USER_ACTIVITIES: UserActivity[] = [
  { id: 1, userId: 2, username: 'UserTech', type: 'login', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
  { id: 2, userId: 1, username: 'AdminLC', type: 'login', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: 3, userId: 2, username: 'UserTech', type: 'register', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) },
];

export const COMMENTS: Comment[] = [
  { id: 1, postId: 1, userId: 2, username: 'UserTech', avatarUrl: USERS.find(u => u.id === 2)?.avatarUrl, content: 'Bài viết rất hay! AI thực sự đang thay đổi bộ mặt của y học.', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
  { id: 2, postId: 2, userId: 1, username: 'AdminLC', avatarUrl: USERS.find(u => u.id === 1)?.avatarUrl, content: 'Cảm ơn bạn! React Server Components chắc chắn là một chủ đề đáng để khám phá sâu hơn.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) },
  { id: 3, postId: 1, userId: 1, username: 'AdminLC', avatarUrl: USERS.find(u => u.id === 1)?.avatarUrl, content: 'Rất vui vì bạn thấy nó hữu ích. Tiềm năng của AI trong lĩnh vực này là vô hạn.', timestamp: new Date(Date.now() - 1000 * 60 * 15) },
];


export const POSTS: Post[] = [
  {
    id: 1,
    title: "Tương lai của Trí tuệ nhân tạo trong Y học",
    author: "AdminLC",
    authorId: 1,
    date: "25 tháng 7, 2024",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // Set to 3 hours ago to be "new"
    category: PostCategory.AI,
    summary: "Khám phá cách AI đang cách mạng hóa chẩn đoán, điều trị và khám phá thuốc trong ngành chăm sóc sức khỏe.",
    imageUrl: "https://picsum.photos/seed/ai-health/600/400",
  },
  {
    id: 2,
    title: "Hướng dẫn toàn diện về React Server Components",
    author: "UserTech",
    authorId: 2,
    date: "24 tháng 7, 2024",
    createdAt: new Date("2024-07-24T10:00:00Z"),
    category: PostCategory.WebDev,
    summary: "Tìm hiểu sâu về React Server Components, chúng hoạt động như thế nào và tại sao chúng là một bước ngoặt cho phát triển web.",
    imageUrl: "https://picsum.photos/seed/react-dev/600/400",
  },
  {
    id: 3,
    title: "Xây dựng ứng dụng đa nền tảng với Flutter 3",
    author: "UserTech",
    authorId: 2,
    date: "23 tháng 7, 2024",
    createdAt: new Date("2024-07-23T10:00:00Z"),
    category: PostCategory.Mobile,
    summary: "Một hướng dẫn thực tế để xây dựng các ứng dụng di động đẹp và hiệu năng cao cho cả iOS và Android từ một cơ sở mã duy nhất.",
    imageUrl: "https://picsum.photos/seed/flutter-app/600/400",
  },
  {
    id: 4,
    title: "Các mối đe dọa an ninh mạng hàng đầu cần chú ý trong năm 2024",
    author: "AdminLC",
    authorId: 1,
    date: "22 tháng 7, 2024",
    createdAt: new Date("2024-07-22T10:00:00Z"),
    category: PostCategory.Cybersecurity,
    summary: "Luôn đi trước một bước với phân tích chuyên sâu về các mối đe dọa an ninh mạng mới nổi, từ ransomware đến các cuộc tấn công lừa đảo.",
    imageUrl: "https://picsum.photos/seed/cyber-sec/600/400",
  },
  {
    id: 5,
    title: "Cuộc cách mạng máy tính lượng tử: Nó có ý nghĩa gì với bạn?",
    author: "AdminLC",
    authorId: 1,
    date: "21 tháng 7, 2024",
    createdAt: new Date("2024-07-21T10:00:00Z"),
    category: PostCategory.Hardware,
    summary: "Giải mã sự phức tạp của máy tính lượng tử và khám phá tiềm năng của nó trong việc giải quyết các vấn đề lớn nhất của thế giới.",
    imageUrl: "https://picsum.photos/seed/quantum-cpu/600/400",
  },
  {
    id: 6,
    title: "Kiến trúc Microservices trên AWS: Thực hành tốt nhất",
    author: "AdminLC",
    authorId: 1,
    date: "20 tháng 7, 2024",
    createdAt: new Date("2024-07-20T10:00:00Z"),
    category: PostCategory.Cloud,
    summary: "Học cách thiết kế, triển khai và quản lý các ứng dụng có khả năng mở rộng và linh hoạt bằng cách sử dụng microservices trên Amazon Web Services.",
    imageUrl: "https://picsum.photos/seed/aws-cloud/600/400",
  },
   {
    id: 7,
    title: "Học sâu cho người mới bắt đầu: Mạng nơ-ron được giải thích",
    author: "UserTech",
    authorId: 2,
    date: "19 tháng 7, 2024",
    createdAt: new Date("2024-07-19T10:00:00Z"),
    category: PostCategory.AI,
    summary: "Một giới thiệu nhẹ nhàng về các khái niệm cốt lõi của học sâu và mạng nơ-ron, hoàn hảo cho những người mới bắt đầu.",
    imageUrl: "https://picsum.photos/seed/deep-learn/600/400",
  },
  {
    id: 8,
    title: "Hiệu suất Web: Tối ưu hóa trang web của bạn để có tốc độ cực nhanh",
    author: "UserTech",
    authorId: 2,
    date: "18 tháng 7, 2024",
    createdAt: new Date("2024-07-18T10:00:00Z"),
    category: PostCategory.WebDev,
    summary: "Các mẹo và kỹ thuật thiết thực để cải thiện đáng kể thời gian tải trang web của bạn và nâng cao trải nghiệm người dùng.",
    imageUrl: "https://picsum.photos/seed/web-perf/600/400",
  },
];
