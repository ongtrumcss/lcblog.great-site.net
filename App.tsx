import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import PostList from './components/PostList';
import CategoryFilter from './components/CategoryFilter';
import SearchBar from './components/SearchBar';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import Admin from './pages/Admin';
import UserDashboard from './pages/UserDashboard';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import UserProfilePage from './pages/UserProfilePage';
import PostsPage from './pages/PostsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import PostDetailPage from './pages/PostDetailPage';
import { POSTS, USERS, USER_ACTIVITIES, COMMENTS } from './constants';
import { Post, PostCategory, User, UserActivity, Toast as ToastType, Comment, Page } from './types';

// --- Toast Components (được định nghĩa ở đây để tuân thủ các ràng buộc) ---

interface ToastProps {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  onRemove: (id: number) => void;
}

const icons = {
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const toastColors = {
  success: 'bg-green-600 border-green-500 text-green-100',
  error: 'bg-red-600 border-red-500 text-red-100',
  info: 'bg-blue-600 border-blue-500 text-blue-100',
};

const ToastComponent: React.FC<ToastProps> = ({ id, message, type, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 4000); // Tự động ẩn sau 4 giây

    return () => clearTimeout(timer);
  }, [id]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(id), 300); // Chờ hoạt ảnh kết thúc
  };

  const animationClass = isExiting ? 'animate-toast-out' : 'animate-toast-in';

  return (
    <div
      role="alert"
      className={`relative w-full max-w-sm p-4 rounded-lg shadow-lg flex items-center space-x-4 border-l-4 ${toastColors[type]} ${animationClass}`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={handleClose}
        className="p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Đóng thông báo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: number) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <>
      <div
        aria-live="assertive"
        className="fixed inset-0 flex flex-col items-end px-4 py-6 pointer-events-none sm:p-6 z-[100]"
        style={{ paddingTop: '80px' }} // Để tránh header
      >
        <div className="w-full flex flex-col items-end space-y-2">
          {toasts.map((toast) => (
            <ToastComponent
              key={toast.id}
              id={toast.id}
              message={toast.message}
              type={toast.type}
              onRemove={onRemove}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes toast-in { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        .animate-toast-in { animation: toast-in 0.3s ease-out forwards; }
        @keyframes toast-out { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100%); } }
        .animate-toast-out { animation: toast-out 0.3s ease-in forwards; }
      `}</style>
    </>
  );
};

// --- Các Component Chính ---

const ErrorDisplay: React.FC<{ message: string; onRetry: () => void; }> = ({ message, onRetry }) => (
  <div className="text-center text-red-400 bg-red-900/20 border border-red-400/30 rounded-lg p-6" role="alert">
    <h2 className="text-xl font-bold mb-2">Rất tiếc, đã có lỗi xảy ra</h2>
    <p className="mb-6">{message}</p>
    <button
      onClick={onRetry}
      className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-purple-500"
    >
      Thử lại
    </button>
  </div>
);

const AppContent: React.FC = () => {
  const { toggleTheme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>(USERS);
  const [userActivities, setUserActivities] = useState<UserActivity[]>(USER_ACTIVITIES);
  const [comments, setComments] = useState<Comment[]>(COMMENTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [viewingPost, setViewingPost] = useState<Post | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [savedPostIds, setSavedPostIds] = useState<number[]>([]);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  
  const DEFAULT_TITLE = 'LC - Your Daily Tech Insight';
  const DEFAULT_DESCRIPTION = "A modern and visually appealing web application for sharing and discovering the latest news, articles, and insights in the world of technology.";

  // Kiểm tra đăng nhập bền bỉ khi tải ứng dụng
  useEffect(() => {
    try {
        const storedUserJSON = localStorage.getItem('currentUser');
        if (storedUserJSON) {
            const storedUser: User = JSON.parse(storedUserJSON);
            // Xác thực người dùng đã lưu với danh sách người dùng hiện tại
            const userInDb = USERS.find(u => u.id === storedUser.id);
            if (userInDb) {
                // Sử dụng dữ liệu mới nhất từ localStorage vì nó chứa avatar đã cập nhật
                setCurrentUser(storedUser);
                // Tải các bài viết đã lưu của người dùng này
                const saved = JSON.parse(localStorage.getItem(`savedPosts_${storedUser.id}`) || '[]');
                if (Array.isArray(saved)) {
                    setSavedPostIds(saved);
                }
            } else {
                // Dữ liệu người dùng không hợp lệ trong localStorage, xóa nó
                localStorage.removeItem('currentUser');
            }
        }
    } catch (e) {
        console.error("Không thể đọc trạng thái người dùng từ localStorage", e);
        localStorage.removeItem('currentUser');
    }
  }, []);

  // Mô phỏng tìm nạp dữ liệu ban đầu
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
        setPosts(POSTS);
        setLoading(false);
    }, 1000); // Mô phỏng thời gian tìm nạp 1 giây
    return () => clearTimeout(timer);
  }, []);

  // Quản lý thẻ title và meta description
  useEffect(() => {
    const metaDescriptionTag = document.querySelector('meta[name="description"]');
    
    if (viewingPost) {
        // Cắt bớt tóm tắt cho meta description ngắn gọn (tốt cho SEO)
        const summaryExcerpt = viewingPost.summary.length > 120
            ? viewingPost.summary.substring(0, 117) + '...'
            : viewingPost.summary;
            
        document.title = `${viewingPost.title} | LC Blog`;
        if (metaDescriptionTag) {
            metaDescriptionTag.setAttribute('content', `${viewingPost.title}: ${summaryExcerpt}`);
        }
    } else {
        document.title = DEFAULT_TITLE;
        if (metaDescriptionTag) {
            metaDescriptionTag.setAttribute('content', DEFAULT_DESCRIPTION);
        }
    }
  }, [viewingPost]);


  const addToast = (message: string, type: ToastType['type'] = 'info') => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };
  
  const handleAddPost = (newPostData: Omit<Post, 'id' | 'date' | 'author' | 'authorId' | 'createdAt'>) => {
    if (!currentUser) return;
    const now = new Date();
    const newPost: Post = {
      ...newPostData,
      id: Date.now(),
      author: currentUser.username,
      authorId: currentUser.id,
      date: now.toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      createdAt: now,
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
    addToast('Bài viết đã được tạo thành công!', 'success');
  };

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts(prevPosts => prevPosts.map(post => post.id === updatedPost.id ? updatedPost : post));
    addToast('Bài viết đã được cập nhật.', 'success');
  };

  const handleDeletePost = (postId: number) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    addToast('Bài viết đã được xóa.', 'success');
  };

  const handleAddComment = (postId: number, content: string) => {
    if (!currentUser) {
        addToast('Bạn cần đăng nhập để bình luận.', 'error');
        return;
    }
    const newComment: Comment = {
        id: Date.now(),
        postId,
        userId: currentUser.id,
        username: currentUser.username,
        avatarUrl: currentUser.avatarUrl,
        content,
        timestamp: new Date(),
    };
    setComments(prevComments => [newComment, ...prevComments]);
    addToast('Bình luận của bạn đã được đăng!', 'success');
  };

  const handleLogin = (username: string, password: string):boolean => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
       try {
          localStorage.setItem('currentUser', JSON.stringify(user));
          const saved = JSON.parse(localStorage.getItem(`savedPosts_${user.id}`) || '[]');
          if (Array.isArray(saved)) {
              setSavedPostIds(saved);
          }
      } catch (e) {
          console.error("Không thể lưu/đọc từ localStorage", e);
          setSavedPostIds([]);
      }
      const newActivity: UserActivity = {
          id: Date.now(),
          userId: user.id,
          username: user.username,
          type: 'login',
          timestamp: new Date(),
      };
      setUserActivities(prev => [newActivity, ...prev].slice(0, 20)); // Keep last 20 activities
      addToast(`Chào mừng trở lại, ${user.username}!`, 'success');
      navigate('home');
      return true;
    }
    addToast('Tên đăng nhập hoặc mật khẩu không chính xác.', 'error');
    return false;
  };

  const handleRegister = (username: string, password: string):boolean => {
     if (users.some(u => u.username === username)) {
        addToast('Tên người dùng đã tồn tại.', 'error');
        return false; // Username already exists
    }
    const newUser: User = {
        id: Date.now(),
        username,
        password,
        role: 'user',
        registeredDate: new Date().toLocaleDateString('vi-VN'),
        avatarUrl: `https://picsum.photos/seed/${Date.now()}/100/100`, // Avatar mặc định cho người dùng mới
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
    setCurrentUser(newUser);
    setSavedPostIds([]); // Start with an empty saved list for new users
    try {
       localStorage.setItem('currentUser', JSON.stringify(newUser));
    } catch(e) {
        console.error("Không thể lưu người dùng mới vào localStorage", e);
    }

    const newActivity: UserActivity = {
        id: Date.now(),
        userId: newUser.id,
        username: newUser.username,
        type: 'register',
        timestamp: new Date(),
    };
    setUserActivities(prev => [newActivity, ...prev].slice(0, 20));
    
    addToast(`Tài khoản ${newUser.username} đã được tạo!`, 'success');
    navigate('home');
    return true;
  }

  const handleLogout = () => {
    setCurrentUser(null);
    setSavedPostIds([]); // Xóa bài viết đã lưu khi đăng xuất
    try {
        localStorage.removeItem('currentUser');
    } catch (e) {
        console.error("Không thể xóa người dùng khỏi localStorage", e);
    }
    navigate('home');
    addToast('Bạn đã đăng xuất.', 'info');
  };

  const handleUpdateUserProfile = (userId: number, newUsername: string, newPassword?: string, newAvatarUrl?: string): boolean => {
    if (users.some(user => user.id !== userId && user.username === newUsername)) {
        addToast('Tên người dùng đã tồn tại.', 'error');
        return false;
    }

    let updatedUser: User | null = null;
    const updatedUsers = users.map(user => {
        if (user.id === userId) {
            updatedUser = {
                ...user,
                username: newUsername,
                password: newPassword ? newPassword : user.password,
                avatarUrl: newAvatarUrl !== undefined ? newAvatarUrl : user.avatarUrl,
            };
            return updatedUser;
        }
        return user;
    });
    
    if(updatedUser){
        setUsers(updatedUsers);
        setCurrentUser(updatedUser);
        try {
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        } catch (e) {
            console.error("Không thể cập nhật người dùng trong localStorage", e);
        }
        addToast('Hồ sơ đã được cập nhật thành công!', 'success');
        navigateToDashboard();
        return true;
    }

    addToast('Không thể tìm thấy người dùng để cập nhật.', 'error');
    return false;
  };

  const handleToggleSavePost = (postId: number) => {
    if (!currentUser) {
        addToast('Vui lòng đăng nhập để lưu bài viết.', 'error');
        navigate('login');
        return;
    }
    let isSaving = false;
    setSavedPostIds(prevIds => {
        const isSaved = prevIds.includes(postId);
        isSaving = !isSaved;
        const newIds = isSaved
            ? prevIds.filter(id => id !== postId)
            : [...prevIds, postId];
        
        try {
            localStorage.setItem(`savedPosts_${currentUser.id}`, JSON.stringify(newIds));
        } catch (e) {
            console.error("Không thể lưu bài viết vào localStorage", e);
            addToast('Không thể lưu bài viết.', 'error');
        }

        return newIds;
    });
    addToast(isSaving ? 'Đã lưu bài viết!' : 'Đã bỏ lưu bài viết.', 'info');
  };

  const navigate = (page: Page) => {
    setCurrentPage(page);
    setViewingPost(null); // Đảm bảo thoát khỏi chế độ xem chi tiết khi điều hướng
    window.scrollTo(0, 0);
  }

  const navigateToDashboard = () => {
    if (currentUser?.role === 'admin') {
      navigate('admin');
    } else {
      navigate('dashboard');
    }
  };

  const handleViewPost = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setViewingPost(post);
      window.scrollTo(0, 0);
    }
  };

  const handleClosePost = () => {
    setViewingPost(null);
  };

  const handleNavigateToAdminTest = () => {
    const adminUser = users.find(u => u.role === 'admin');
    if (adminUser) {
        setCurrentUser(adminUser);
        navigate('admin');
    } else {
        console.error("Không tìm thấy người dùng quản trị để thử nghiệm.");
        addToast("Không tìm thấy tài khoản admin để thử nghiệm.", "error");
    }
  };
  
  const recentPosts = posts.slice(0, 4);

  const renderMainContent = () => {
    if (viewingPost) {
      return (
        <>
          <PostDetailPage
            post={viewingPost}
            onNavigateBack={handleClosePost}
            currentUser={currentUser}
            comments={comments.filter(c => c.postId === viewingPost.id)}
            onAddComment={handleAddComment}
            onNavigateToLogin={() => navigate('login')}
          />
          <Footer />
        </>
      );
    }

    switch (currentPage) {
      case 'admin':
        return currentUser?.role === 'admin' ? (
          <Admin 
            currentUser={currentUser}
            posts={posts}
            users={users}
            userActivities={userActivities}
            onAddPost={handleAddPost}
            onUpdatePost={handleUpdatePost}
            onDeletePost={handleDeletePost}
            onNavigateHome={() => navigate('home')} 
          />
        ) : <main className="container mx-auto px-4 py-16 text-center">Không có quyền truy cập.</main>;
      case 'dashboard':
        return currentUser ? (
           <UserDashboard
              currentUser={currentUser}
              userPosts={posts.filter(p => p.authorId === currentUser.id)}
              allPosts={posts}
              savedPostIds={savedPostIds}
              onAddPost={handleAddPost}
              onUpdatePost={handleUpdatePost}
              onDeletePost={handleDeletePost}
              onToggleSave={handleToggleSavePost}
              onNavigateHome={() => navigate('home')}
              onViewPost={handleViewPost}
            />
        ) : <main className="container mx-auto px-4 py-16 text-center">Vui lòng đăng nhập.</main>;
      case 'profile':
        return currentUser ? (
            <UserProfilePage
                currentUser={currentUser}
                onUpdateProfile={handleUpdateUserProfile}
                onNavigateBack={navigateToDashboard}
            />
        ) : <main className="container mx-auto px-4 py-16 text-center">Vui lòng đăng nhập để xem hồ sơ.</main>;
      case 'login':
        return <LoginPage 
                  onLogin={handleLogin} 
                  onNavigateToRegister={() => navigate('register')} 
                  onNavigateToForgotPassword={() => navigate('forgotPassword')} 
                />;
      case 'register':
        return <RegisterPage onRegister={handleRegister} onNavigateToLogin={() => navigate('login')} />;
      case 'forgotPassword':
        return <ForgotPasswordPage onNavigateToLogin={() => navigate('login')} />;
      case 'posts':
        return (
            <>
                <PostsPage
                    posts={posts}
                    savedPostIds={savedPostIds}
                    onToggleSave={handleToggleSavePost}
                    onViewPost={handleViewPost}
                />
                <Footer />
            </>
        );
       case 'about':
        return (
            <>
                <AboutPage />
                <Footer />
            </>
        );
      case 'contact':
        return (
            <>
                <ContactPage addToast={addToast} />
                <Footer />
            </>
        );
      case 'home':
        return (
          <>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    LC Blog
                  </span>
                </h1>
                <p className="max-w-3xl mx-auto text-lg md:text-xl text-neutral-300">
                  Khám phá những bài viết mới nhất về công nghệ, lập trình và hơn thế nữa. Cập nhật kiến thức và khơi nguồn cảm hứng mỗi ngày.
                </p>
              </div>
              <h2 className="text-3xl font-bold text-white mb-8">Bài viết gần đây</h2>
               {error ? (
                <ErrorDisplay message={error} onRetry={() => setError(null)} />
              ) : (
                <PostList
                  posts={recentPosts}
                  savedPostIds={savedPostIds}
                  onToggleSave={handleToggleSavePost}
                  onViewPost={handleViewPost}
                  loading={loading}
                  skeletonCount={4}
                />
              )}
              <div className="text-center mt-16">
                  <button 
                    onClick={() => navigate('posts')}
                    className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-purple-500"
                  >
                    Xem tất cả bài viết
                  </button>
              </div>
            </main>
            <Footer />
          </>
        );
      case 'notFound':
      default:
        return (
            <>
                <NotFoundPage onNavigateHome={() => navigate('home')} />
                <Footer />
            </>
        );
    }
  }

  return (
    <div className="bg-gray-950 dark:bg-gray-900 text-white min-h-screen font-sans transition-colors duration-300">
      <KeyboardShortcuts
        onNavigateHome={() => navigate('home')}
        onNavigatePosts={() => navigate('posts')}
        onNavigateAbout={() => navigate('about')}
        onNavigateContact={() => navigate('contact')}
        onToggleTheme={toggleTheme}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <Header 
        currentPage={currentPage}
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigateToDashboard={navigateToDashboard}
        onNavigateToLogin={() => navigate('login')}
        onNavigateToRegister={() => navigate('register')}
        onNavigateToAdminTest={handleNavigateToAdminTest}
        onNavigateHome={() => navigate('home')}
        onNavigateToPosts={() => navigate('posts')}
        onNavigateToAbout={() => navigate('about')}
        onNavigateToContact={() => navigate('contact')}
        onNavigateToProfile={() => navigate('profile')}
      />
      {renderMainContent()}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;