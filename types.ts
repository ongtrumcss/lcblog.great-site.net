// types.ts
export enum PostCategory {
  AI = "Trí tuệ nhân tạo",
  WebDev = "Phát triển Web",
  Mobile = "Di động",
  Cybersecurity = "An ninh mạng",
  Hardware = "Phần cứng",
  Cloud = "Điện toán đám mây",
}

export interface Post {
  id: number;
  title: string;
  author: string;
  authorId: number;
  date: string;
  createdAt: Date;
  category: PostCategory;
  summary: string;
  imageUrl: string;
}

export interface User {
  id: number;
  username: string;
  password?: string; // Password is for simulation, not for production
  role: 'admin' | 'user';
  registeredDate: string;
  avatarUrl?: string;
}

export type UserActivityType = 'register' | 'login';

export interface UserActivity {
    id: number;
    userId: number;
    username: string;
    type: UserActivityType;
    timestamp: Date;
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  username: string;
  avatarUrl?: string;
  content: string;
  timestamp: Date;
}

export type Page =
  | 'home'
  | 'posts'
  | 'about'
  | 'contact'
  | 'admin'
  | 'dashboard'
  | 'login'
  | 'register'
  | 'forgotPassword'
  | 'profile'
  | 'notFound';