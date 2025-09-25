import React, { useState, useEffect } from 'react';
import { Post, PostCategory } from '../types';
import PostList from '../components/PostList';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';

interface PostsPageProps {
  posts: Post[];
  savedPostIds: number[];
  onToggleSave: (postId: number) => void;
  onViewPost: (postId: number) => void;
}

const PostsPage: React.FC<PostsPageProps> = ({ posts, savedPostIds, onToggleSave, onViewPost }) => {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mô phỏng tải dữ liệu khi trang được tải hoặc bộ lọc thay đổi
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Mô phỏng độ trễ

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  const filteredPosts: Post[] = posts
    .filter(post => selectedCategory === 'all' || post.category === selectedCategory)
    .filter(post => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        post.title.toLowerCase().includes(query) ||
        post.summary.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query)
      );
    });

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Tất cả bài viết
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-neutral-300">
          Duyệt qua bộ sưu tập đầy đủ các bài viết của chúng tôi. Sử dụng các công cụ bên dưới để tìm kiếm và lọc theo sở thích của bạn.
        </p>
      </div>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <PostList
        posts={filteredPosts}
        savedPostIds={savedPostIds}
        onToggleSave={onToggleSave}
        onViewPost={onViewPost}
        loading={loading}
      />
    </main>
  );
};

export default PostsPage;
