import React from 'react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  isSaved: boolean;
  onToggleSave: (postId: number) => void;
  onViewPost: (postId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, isSaved, onToggleSave, onViewPost }) => {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn chặn điều hướng nếu thẻ được bọc trong một liên kết
    e.stopPropagation();
    onToggleSave(post.id);
  };

  const diffInMs = new Date().getTime() - new Date(post.createdAt).getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const isNew = diffInHours < 24;

  return (
    <div 
      onClick={() => onViewPost(post.id)}
      className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 group flex flex-col cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === 'Enter') onViewPost(post.id) }}
      aria-label={`Xem bài viết: ${post.title}`}
    >
      <div className="relative overflow-hidden">
        <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out" />
        <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-800/70 backdrop-blur-sm text-neutral-200 border border-gray-700">
                {post.category}
            </span>
            {isNew && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-600 text-white animate-pulse">
                    MỚI
                </span>
            )}
        </div>
        <button
            onClick={handleSaveClick}
            className={`absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-sm transition-colors duration-200 hover:bg-black/75 ${isSaved ? 'text-purple-400' : 'text-white/80 hover:text-white'}`}
            aria-label={isSaved ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}
            title={isSaved ? 'Bỏ lưu' : 'Lưu lại'}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" 
                fill={isSaved ? "currentColor" : "none"}
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
        </button>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-200">
          {post.title}
        </h3>
        <div className="text-xs text-neutral-400 mb-4 flex items-center">
            <span>{post.author}</span>
            <span className="mx-2">&bull;</span>
            <span>{post.date}</span>
        </div>
        <p className="text-neutral-300 text-sm flex-grow">
          {post.summary}
        </p>
        <div className="mt-6">
            <span className="font-semibold text-neutral-200 group-hover:text-white transition-colors duration-200 flex items-center">
                Đọc thêm
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;