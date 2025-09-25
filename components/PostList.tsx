import React from 'react';
import { Post } from '../types';
import PostCard from './PostCard';
import SkeletonPostCard from './SkeletonPostCard';

interface PostListProps {
  posts: Post[];
  savedPostIds: number[];
  onToggleSave: (postId: number) => void;
  onViewPost: (postId: number) => void;
  loading: boolean;
  skeletonCount?: number;
}

const PostList: React.FC<PostListProps> = ({ posts, savedPostIds, onToggleSave, onViewPost, loading, skeletonCount = 8 }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <SkeletonPostCard key={index} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 col-span-full">
        <h2 className="text-2xl font-bold text-neutral-300">Không tìm thấy bài viết nào</h2>
        <p className="text-neutral-400 mt-2">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {posts.map(post => (
        <PostCard 
            key={post.id} 
            post={post}
            isSaved={savedPostIds.includes(post.id)}
            onToggleSave={onToggleSave}
            onViewPost={onViewPost}
        />
      ))}
    </div>
  );
};

export default PostList;