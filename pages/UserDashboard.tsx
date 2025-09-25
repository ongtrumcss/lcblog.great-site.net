import React, { useState, useEffect } from 'react';
import { Post, PostCategory, User } from '../types';
import Modal from '../components/Modal';
import ImagePickerModal from '../components/ImagePickerModal';
import SkeletonListItem from '../components/skeletons/SkeletonListItem';
import PostCard from '../components/PostCard';
import SkeletonPostCard from '../components/SkeletonPostCard';


interface UserDashboardProps {
  currentUser: User;
  userPosts: Post[];
  allPosts: Post[];
  savedPostIds: number[];
  // Fix: The 'createdAt' property is generated in the parent component, so it should be omitted from the type here.
  onAddPost: (newPost: Omit<Post, 'id' | 'date' | 'author' | 'authorId' | 'createdAt'>) => void;
  onUpdatePost: (updatedPost: Post) => void;
  onDeletePost: (postId: number) => void;
  onToggleSave: (postId: number) => void;
  onNavigateHome: () => void;
  onViewPost: (postId: number) => void;
}

type DashboardTab = 'myPosts' | 'savedPosts';

const UserDashboard: React.FC<UserDashboardProps> = ({ currentUser, userPosts, allPosts, savedPostIds, onAddPost, onUpdatePost, onDeletePost, onToggleSave, onViewPost }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PostCategory>(PostCategory.AI);
  const [summary, setSummary] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>('myPosts');
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  
  const savedPosts = allPosts.filter(post => savedPostIds.includes(post.id));

  useEffect(() => {
    setIsDataLoading(true);
    const timer = setTimeout(() => setIsDataLoading(false), 500); // Simulate data loading
    return () => clearTimeout(timer);
  }, [activeTab]);


  const resetForm = () => {
    setTitle('');
    setCategory(PostCategory.AI);
    setSummary('');
    setImageUrl('');
    setEditingPost(null);
  };

  const handleImageSelect = (url: string) => {
    setImageUrl(url);
    setIsImagePickerOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !summary || !imageUrl) return;

    setIsSubmitting(true);

    if (editingPost) {
        onUpdatePost({ 
            ...editingPost, 
            title, 
            category, 
            summary,
            imageUrl
        });
    } else {
        onAddPost({ title, category, summary, imageUrl });
    }
    
    resetForm();
    setIsSubmitting(false);
  };

  const handleEditClick = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setCategory(post.category);
    setSummary(post.summary);
    setImageUrl(post.imageUrl);
  };

  const confirmDeletePost = () => {
    if (postToDelete) {
        onDeletePost(postToDelete.id);
        setPostToDelete(null);
    }
  };

  const renderTabs = () => (
    <div className="mb-8 border-b border-gray-800">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
                onClick={() => setActiveTab('myPosts')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors ${
                    activeTab === 'myPosts'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:border-gray-600'
                }`}
            >
                Bài viết của tôi ({userPosts.length})
            </button>
            <button
                onClick={() => setActiveTab('savedPosts')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors ${
                    activeTab === 'savedPosts'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:border-gray-600'
                }`}
            >
                Bài viết đã lưu ({savedPosts.length})
            </button>
        </nav>
    </div>
  );

  const renderMyPosts = () => (
    <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 sticky top-28">
            <h2 className="text-2xl font-bold mb-6 text-center">{editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-neutral-300 mb-2">Tiêu đề</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required />
              </div>
               <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Hình ảnh bài viết</label>
                  <div className="mt-2 flex items-center gap-4">
                      <div className="w-32 h-20 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden">
                          {imageUrl ? (
                              <img src={imageUrl} alt="Xem trước" className="w-full h-full object-cover" />
                          ) : (
                              <span className="text-xs text-neutral-500 text-center p-1">Xem trước</span>
                          )}
                      </div>
                      <button
                          type="button"
                          onClick={() => setIsImagePickerOpen(true)}
                          className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                      >
                          Chọn ảnh
                      </button>
                  </div>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-neutral-300 mb-2">Danh mục</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value as PostCategory)} className="w-full px-3 py-2 text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required >
                  {Object.values(PostCategory).map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
              </div>
              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-neutral-300 mb-2">Tóm tắt</label>
                <textarea id="summary" rows={4} value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full px-3 py-2 text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required ></textarea>
              </div>
              <div className="space-y-2 pt-4 border-t border-gray-700/50">
                <button type="button" onClick={() => setIsPreviewing(true)} disabled={!title || !summary || !imageUrl} className="w-full px-8 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-300 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500">
                    Xem trước
                </button>
                <button type="submit" disabled={isSubmitting} className={`w-full px-8 py-3 text-white font-bold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${ editingPost ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'} disabled:bg-gray-500 disabled:cursor-not-allowed`} >
                  {isSubmitting ? 'Đang xử lý...' : (editingPost ? 'Cập nhật bài viết' : 'Đăng bài')}
                </button>
                {editingPost && (<button type="button" onClick={resetForm} className="w-full px-8 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-300">Hủy</button>)}
              </div>
            </form>
          </div>
        </div>
        <div className="lg:col-span-2">
            <div className="space-y-4">
               {isDataLoading ? (
                 Array.from({ length: 3 }).map((_, index) => <SkeletonListItem key={index} />)
              ) : userPosts.length > 0 ? (
                userPosts.map(post => (
                  <div key={post.id} className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex items-center justify-between transition-colors hover:bg-gray-800/50">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-white truncate">{post.title}</h3>
                      <p className="text-sm text-neutral-400">{post.date} &bull; <span className="font-medium text-neutral-300">{post.category}</span></p>
                    </div>
                    <div className="flex-shrink-0 ml-4 flex items-center space-x-2">
                      <button onClick={() => setViewingPost(post)} className="px-3 py-1.5 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors duration-200" aria-label={`Xem chi tiết bài viết ${post.title}`}>Chi tiết</button>
                      <button onClick={() => handleEditClick(post)} className="px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200" aria-label={`Sửa bài viết ${post.title}`}>Sửa</button>
                      <button onClick={() => setPostToDelete(post)} className="px-3 py-1.5 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200" aria-label={`Xóa bài viết ${post.title}`}>Xóa</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-gray-900 rounded-lg border border-dashed border-gray-700">
                    <p className="text-neutral-400 text-lg">Bạn chưa có bài viết nào.</p>
                    <p className="text-neutral-500 text-sm mt-2">Sử dụng biểu mẫu bên cạnh để tạo bài viết đầu tiên của bạn.</p>
                </div>
              )}
            </div>
          </div>
    </div>
  );

   const renderSavedPosts = () => (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {isDataLoading ? (
                 Array.from({ length: 3 }).map((_, index) => <SkeletonPostCard key={index} />)
            ) : savedPosts.length > 0 ? (
                savedPosts.map(post => (
                    <PostCard
                        key={post.id}
                        post={post}
                        isSaved={true} // Always saved in this list
                        onToggleSave={onToggleSave}
                        onViewPost={onViewPost}
                    />
                ))
            ) : (
                <div className="text-center py-16 bg-gray-900 rounded-lg border border-dashed border-gray-700 col-span-full">
                    <p className="text-neutral-400 text-lg">Bạn chưa lưu bài viết nào.</p>
                    <p className="text-neutral-500 text-sm mt-2">Nhấn vào biểu tượng bookmark trên bài viết để lưu lại đọc sau.</p>
                </div>
            )}
        </div>
    </div>
  );

  return (
    <div className="bg-gray-950 text-white min-h-screen font-sans">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-2">Bảng điều khiển</h1>
        <p className="text-lg text-neutral-400 mb-8">Chào mừng trở lại, {currentUser.username}!</p>
        
        {renderTabs()}

        {activeTab === 'myPosts' ? renderMyPosts() : renderSavedPosts()}

      </main>

      <ImagePickerModal 
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onImageSelect={handleImageSelect}
      />

      {viewingPost && (
        <Modal
            isOpen={!!viewingPost}
            onClose={() => setViewingPost(null)}
            title={viewingPost.title}
        >
            <div className="space-y-4">
                <div className="text-sm text-neutral-400 border-b border-gray-800 pb-3">
                    <p><strong className="text-neutral-300">Tác giả:</strong> {viewingPost.author}</p>
                    <p><strong className="text-neutral-300">Ngày đăng:</strong> {viewingPost.date}</p>
                    <p><strong className="text-neutral-300">Danh mục:</strong> {viewingPost.category}</p>
                </div>
                <p className="text-neutral-300 whitespace-pre-wrap leading-relaxed">{viewingPost.summary}</p>
            </div>
        </Modal>
      )}
       {isPreviewing && (
        <Modal
            isOpen={isPreviewing}
            onClose={() => setIsPreviewing(false)}
            title="Xem trước bài viết"
        >
            <div className="text-white">
                {imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt="Xem trước hình ảnh" 
                        className="w-full h-64 object-cover rounded-lg mb-4 bg-gray-800"
                    />
                ) : (
                    <div className="w-full h-64 bg-gray-800 rounded-lg mb-4 flex items-center justify-center text-neutral-500">
                        Chưa có URL hình ảnh
                    </div>
                )}
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-600/50 text-purple-300">
                    {category}
                </span>
                <h3 className="text-3xl font-bold text-white mt-4 mb-2">{title || "[Chưa có tiêu đề]"}</h3>
                <div className="text-sm text-neutral-400 mb-6">
                    <span>Bởi <strong>{currentUser.username}</strong></span>
                    <span className="mx-2">&bull;</span>
                    <span>Vừa xong</span>
                </div>
                <div className="prose prose-invert prose-p:text-neutral-300 prose-p:leading-relaxed max-w-none">
                     <p>{summary || "[Chưa có tóm tắt]"}</p>
                </div>
            </div>
        </Modal>
      )}
      {postToDelete && (
        <Modal
            isOpen={!!postToDelete}
            onClose={() => setPostToDelete(null)}
            title="Xác nhận xóa bài viết"
        >
            <div>
                <p className="text-neutral-300 mb-6">
                    Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.
                </p>
                 <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <p className="font-bold text-white truncate">{postToDelete.title}</p>
                </div>
                <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-800 space-x-3">
                    <button
                        onClick={() => setPostToDelete(null)}
                        className="py-2 px-5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={confirmDeletePost}
                        className="py-2 px-5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default UserDashboard;