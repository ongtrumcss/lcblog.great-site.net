import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Post, PostCategory, User, UserActivity } from '../types';
import AnalyticsChart from '../components/AnalyticsChart';
import Modal from '../components/Modal';
import ImagePickerModal from '../components/ImagePickerModal';
import SkeletonTableRow from '../components/skeletons/SkeletonTableRow';
import SkeletonListItem from '../components/skeletons/SkeletonListItem';


// This is a placeholder for a real API key, which should be stored securely
const API_KEY = process.env.API_KEY;

interface AdminProps {
  currentUser: User;
  posts: Post[];
  users: User[];
  userActivities: UserActivity[];
  // Fix: The 'createdAt' property is generated in the parent component, so it should be omitted from the type here.
  onAddPost: (newPost: Omit<Post, 'id' | 'date' | 'author' | 'authorId' | 'createdAt'>) => void;
  onUpdatePost: (updatedPost: Post) => void;
  onDeletePost: (postId: number) => void;
  onNavigateHome: () => void;
}

type AdminTab = 'dashboard' | 'posts' | 'create' | 'features' | 'users';
type SortablePostKeys = keyof Pick<Post, 'title' | 'author' | 'category' | 'date'>;


const StatCard: React.FC<{
  title: string;
  value: string | number;
  trend: string;
  trendDirection: 'up' | 'down';
  icon: React.ReactNode;
}> = ({ title, value, trend, trendDirection, icon }) => (
    <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 transition-all duration-300 hover:border-purple-600/60 hover:bg-gray-800/40 transform hover:-translate-y-1">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-neutral-400 font-medium">{title}</p>
                <p className="text-3xl font-bold text-white mt-1">{value}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-full border border-gray-700">
                {icon}
            </div>
        </div>
        <div className="flex items-center text-sm mt-3">
            {trendDirection === 'up' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.56l-1.72 1.72a.75.75 0 01-1.06-1.06l3-3a.75.75 0 011.06 0l3 3a.75.75 0 11-1.06 1.06l-1.72-1.72v10.69a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.69l1.72-1.72a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.06 0l-3-3a.75.75 0 111.06-1.06l1.72 1.72V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
                </svg>
            )}
            <span className={`font-semibold ${trendDirection === 'up' ? 'text-green-400' : 'text-red-400'}`}>{trend}</span>
            <span className="text-neutral-500 ml-1">so với tháng trước</span>
        </div>
    </div>
);

const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `vài giây trước`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ngày trước`;
    
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} tháng trước`;
    
    const years = Math.floor(months / 12);
    return `${years} năm trước`;
};

const Admin: React.FC<AdminProps> = ({ currentUser, posts, users, userActivities, onAddPost, onUpdatePost, onDeletePost, onNavigateHome }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PostCategory>(PostCategory.AI);
  const [summary, setSummary] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'7d' | '30d' | '365d'>('30d');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  // State for post table
  const [postSearchQuery, setPostSearchQuery] = useState('');
  const [postCategoryFilter, setPostCategoryFilter] = useState<PostCategory | 'all'>('all');
  const [sortConfig, setSortConfig] = useState<{ key: SortablePostKeys; direction: 'ascending' | 'descending' } | null>({ key: 'date', direction: 'descending' });

  useEffect(() => {
    setIsDataLoading(true);
    const timer = setTimeout(() => setIsDataLoading(false), 500); // Simulate data loading
    return () => clearTimeout(timer);
  }, [activeTab]);

  const generatePostIdea = async () => {
    setIsGeneratingIdea(true);
    try {
      if (!API_KEY || API_KEY === 'undefined' || API_KEY === '') {
        throw new Error("API key is missing. Please configure GEMINI_API_KEY in .env.local file.");
      }
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      
      const schema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "Tiêu đề hấp dẫn cho bài viết blog công nghệ." },
            summary: { type: Type.STRING, description: "Một đoạn tóm tắt ngắn (2-3 câu) về nội dung bài viết." },
            category: { type: Type.STRING, enum: Object.values(PostCategory), description: "Một trong các danh mục được cung cấp." }
        },
        required: ["title", "summary", "category"]
      };

      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Tạo một ý tưởng bài viết blog công nghệ mới và sáng tạo. Cung cấp tiêu đề, tóm tắt ngắn và chọn một danh mục từ danh sách sau: ${Object.values(PostCategory).join(', ')}.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
        }
      });
      const idea = JSON.parse(result.text);

      // Validate the category received from AI
      const isValidCategory = Object.values(PostCategory).includes(idea.category as PostCategory);
      
      setTitle(idea.title);
      setSummary(idea.summary);
      setCategory(isValidCategory ? idea.category : PostCategory.AI); // Default to AI if category is invalid
      
    } catch (error) {
        console.error("Error generating post idea:", error);
        alert("Không thể tạo ý tưởng bài viết. Vui lòng thử lại.");
    } finally {
        setIsGeneratingIdea(false);
    }
  };


  const analyticsData = useMemo(() => {
    const generateData = (days: number, maxViews: number) => {
        const data = [];
        let monthLabelCache = '';
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            let label = '';
            if (days <= 30) {
                 label = date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' });
            } else {
                 const currentMonthLabel = date.toLocaleString('vi-VN', { month: 'short' });
                 // Avoid duplicate month labels
                 label = currentMonthLabel !== monthLabelCache ? currentMonthLabel : '';
                 monthLabelCache = currentMonthLabel;
            }
            data.push({
                value: Math.floor(Math.random() * (maxViews - maxViews * 0.3) + maxViews * 0.3),
                label
            });
        }
        return data;
    };
     switch (analyticsTimeframe) {
        case '7d': return generateData(7, 1500);
        case '365d': return generateData(12, 50000);
        case '30d': 
        default: return generateData(30, 2000);
    }
  }, [analyticsTimeframe]);

  const filteredAndSortedPosts = useMemo(() => {
    let filteredPosts = [...posts];

    // Filter by category
    if (postCategoryFilter !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === postCategoryFilter);
    }

    // Filter by search query
    if (postSearchQuery) {
      const lowercasedQuery = postSearchQuery.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(lowercasedQuery) ||
        post.author.toLowerCase().includes(lowercasedQuery)
      );
    }

    // Sort
    if (sortConfig !== null) {
      filteredPosts.sort((a, b) => {
        let aValue, bValue;
        
        // Use post ID for date sorting for accuracy
        if (sortConfig.key === 'date') {
          aValue = a.id;
          bValue = b.id;
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredPosts;
  }, [posts, postSearchQuery, postCategoryFilter, sortConfig]);

  const requestSort = (key: SortablePostKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key: SortablePostKeys) => {
    if (!sortConfig || sortConfig.key !== key) {
        return <span className="opacity-0 group-hover:opacity-50 transition-opacity">↕️</span>;
    }
    return sortConfig.direction === 'ascending' ? '🔼' : '🔽';
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
        user.username.toLowerCase().includes(userSearchQuery.toLowerCase())
    );
  }, [users, userSearchQuery]);

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

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !summary || !imageUrl) return;

    setIsSubmitting(true);
    
    if (editingPost) {
        onUpdatePost({ ...editingPost, title, category, summary, imageUrl });
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
    setActiveTab('create');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  const confirmDeletePost = () => {
    if (postToDelete) {
      onDeletePost(postToDelete.id);
      setPostToDelete(null);
    }
  };
  
  const NavItem: React.FC<{ tab: AdminTab; label: string; icon: React.ReactNode; isActive: boolean; }> = ({ tab, label, icon, isActive }) => (
      <button
        onClick={() => setActiveTab(tab)}
        className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
          isActive ? 'bg-purple-600 text-white' : 'text-neutral-300 hover:bg-gray-700'
        }`}
      >
        {icon}
        <span className="ml-3">{label}</span>
      </button>
  );

  // Calculate dashboard data outside of renderContent
  const totalViews = useMemo(() => analyticsData.reduce((sum, item) => sum + item.value, 0), [analyticsData]);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const newUsersThisMonth = useMemo(() => users.filter(u => {
      const [day, month, year] = u.registeredDate.split('/');
      const registeredDate = new Date(`${year}-${month}-${day}`);
      return registeredDate > thirtyDaysAgo;
  }).length, [users, thirtyDaysAgo]);

  const postsThisMonth = useMemo(() => posts.filter(p => p.createdAt > thirtyDaysAgo).length, [posts, thirtyDaysAgo]);

  const renderContent = () => {
    switch(activeTab) {
        case 'dashboard':

            return (
                <section>
                    <h2 className="text-3xl font-bold mb-6">Tổng quan</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard title="Tổng lượt xem" value={totalViews.toLocaleString('vi-VN')} trend="+5.2%" trendDirection="up" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>} />
                        <StatCard title="Người dùng mới" value={newUsersThisMonth} trend="+12" trendDirection="up" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} />
                        <StatCard title="Bài viết mới" value={postsThisMonth} trend="-2" trendDirection="down" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
                        <StatCard title="Tỷ lệ tương tác" value="78.5%" trend="+1.8%" trendDirection="up" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-gray-900 p-6 rounded-xl border border-gray-800">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                                <h3 className="font-bold text-xl text-white">Phân tích Lượt xem</h3>
                                <div className="flex items-center space-x-1 bg-gray-800 p-1 rounded-md">
                                    {(['7d', '30d', '365d'] as const).map(tf => (
                                        <button key={tf} onClick={() => setAnalyticsTimeframe(tf)} className={`px-3 py-1 text-sm rounded-md transition-colors ${analyticsTimeframe === tf ? 'bg-purple-600 text-white font-semibold' : 'text-neutral-300 hover:bg-gray-700'}`}>
                                            {tf === '7d' ? '7 ngày' : tf === '30d' ? '30 ngày' : 'Năm'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="h-96">
                               <AnalyticsChart data={analyticsData} />
                            </div>
                        </div>
                         <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                            <h3 className="text-lg font-bold mb-4 text-white">Hoạt động gần đây</h3>
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {userActivities.slice(0, 10).map(activity => (
                                     <div key={activity.id} className="flex items-center text-sm">
                                        <span className={`w-2.5 h-2.5 mr-3 rounded-full ${activity.type === 'register' ? 'bg-green-400' : 'bg-blue-400'}`}></span>
                                        <div className="flex-1">
                                            <span className="font-semibold text-white mr-1">{activity.username}</span>
                                            <span className="text-neutral-400">{activity.type === 'register' ? 'đã đăng ký' : 'đã đăng nhập'}</span>
                                        </div>
                                        <span className="text-neutral-500 text-xs">{formatTimeAgo(activity.timestamp)}</span>
                                     </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            );
        case 'posts':
            return (
                <section>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-3xl font-bold">Quản lý bài viết</h2>
                            <p className="text-sm text-neutral-400 mt-1">{filteredAndSortedPosts.length} bài viết phù hợp</p>
                        </div>
                        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 min-w-[220px]">
                                <input
                                    type="search"
                                    placeholder="Tìm theo tiêu đề, tác giả..."
                                    value={postSearchQuery}
                                    onChange={(e) => setPostSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 text-sm text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                            </div>
                            <select
                                value={postCategoryFilter}
                                onChange={(e) => setPostCategoryFilter(e.target.value as PostCategory | 'all')}
                                className="sm:w-48 px-4 py-2 text-sm text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                                <option value="all">Tất cả danh mục</option>
                                {Object.values(PostCategory).map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                            </select>
                            <select
                                value={`${sortConfig?.key ?? 'date'}:${sortConfig?.direction ?? 'descending'}`}
                                onChange={(e) => {
                                    const [key, direction] = e.target.value.split(':') as [SortablePostKeys, 'ascending' | 'descending'];
                                    setSortConfig({ key, direction });
                                }}
                                className="sm:w-48 px-4 py-2 text-sm text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                                <option value="date:descending">Mới nhất</option>
                                <option value="date:ascending">Cũ nhất</option>
                                <option value="title:ascending">Tiêu đề A→Z</option>
                                <option value="title:descending">Tiêu đề Z→A</option>
                                <option value="author:ascending">Tác giả A→Z</option>
                                <option value="author:descending">Tác giả Z→A</option>
                                <option value="category:ascending">Danh mục A→Z</option>
                                <option value="category:descending">Danh mục Z→A</option>
                            </select>
                            {(postSearchQuery || postCategoryFilter !== 'all' || (sortConfig && (sortConfig.key !== 'date' || sortConfig.direction !== 'descending'))) && (
                                <button
                                    type="button"
                                    onClick={() => { setPostSearchQuery(''); setPostCategoryFilter('all'); setSortConfig({ key: 'date', direction: 'descending' }); }}
                                    className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
                                >
                                    Xóa lọc
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-3">
                            <div className="overflow-x-auto bg-gray-900 rounded-lg border border-gray-800">
                                <table className="w-full text-sm text-left text-neutral-300">
                                    <thead className="text-xs text-neutral-400 uppercase bg-gray-800/80">
                                        <tr>
                                            {([
                                                { key: 'title', label: 'Tiêu đề' },
                                                { key: 'author', label: 'Tác giả' },
                                                { key: 'category', label: 'Danh mục' },
                                                { key: 'date', label: 'Ngày đăng' }
                                            ] as {key: SortablePostKeys, label: string}[]).map(({key, label}) => (
                                                <th key={key} scope="col" className="px-4 py-3 whitespace-nowrap">
                                                    <div
                                                        className="flex items-center cursor-pointer select-none group"
                                                        onClick={() => requestSort(key)}
                                                    >
                                                        {label}
                                                        <span className="ml-1 text-base">{getSortIndicator(key)}</span>
                                                    </div>
                                                </th>
                                            ))}
                                            <th scope="col" className="px-4 py-3 text-right">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isDataLoading ? (
                                             Array.from({ length: 5 }).map((_, index) => <SkeletonTableRow key={index} />)
                                        ) : filteredAndSortedPosts.length > 0 ? (
                                            filteredAndSortedPosts.map(post => (
                                                <tr key={post.id} className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800/50">
                                                    <td className="px-4 py-4 font-medium text-white max-w-xs truncate">{post.title}</td>
                                                    <td className="px-4 py-4">{post.author}</td>
                                                    <td className="px-4 py-4">{post.category}</td>
                                                    <td className="px-4 py-4">{post.date}</td>
                                                    <td className="px-4 py-4 text-right">
                                                        <div className="flex justify-end items-center space-x-2">
                                                            <button onClick={() => setViewingPost(post)} className="px-2 py-1 text-xs font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors" aria-label={`Xem chi tiết ${post.title}`}>Xem</button>
                                                            <button onClick={() => handleEditClick(post)} className="px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors" aria-label={`Sửa ${post.title}`}>Sửa</button>
                                                            <button onClick={() => setPostToDelete(post)} className="px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors" aria-label={`Xóa ${post.title}`}>Xóa</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="text-center py-12 text-neutral-500">
                                                    Không tìm thấy bài viết nào phù hợp.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            );
        case 'create':
            return (
                <section>
                    <h2 className="text-3xl font-bold mb-6">{editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</h2>
                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 lg:col-start-1">
                            <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
                                <form onSubmit={handlePostSubmit} className="space-y-6">
                                    <div>
                                      <label htmlFor="title" className="block text-sm font-medium text-neutral-300 mb-2">Tiêu đề</label>
                                      <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">Hình ảnh bài viết</label>
                                        <div className="mt-2 flex items-center gap-4">
                                            <div className="w-40 h-28 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden">
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
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                          <label htmlFor="category" className="block text-sm font-medium text-neutral-300 mb-2">Danh mục</label>
                                          <select id="category" value={category} onChange={(e) => setCategory(e.target.value as PostCategory)} className="w-full px-3 py-2 text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                                              {Object.values(PostCategory).map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                                          </select>
                                        </div>
                                    </div>
                                    <div>
                                      <label htmlFor="summary" className="block text-sm font-medium text-neutral-300 mb-2">Tóm tắt</label>
                                      <textarea id="summary" rows={6} value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full px-3 py-2 text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required></textarea>
                                    </div>
                                    <div className="space-y-3 pt-2 border-t border-gray-700/50">
                                      <button type="button" onClick={generatePostIdea} disabled={isGeneratingIdea} className="w-full flex justify-center items-center px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed">
                                          {isGeneratingIdea ? (
                                              <>
                                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                              </svg>
                                              Đang xử lý...
                                              </>
                                          ) : (
                                               <>
                                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M11.25 9.75a.75.75 0 000-1.5h-2.5a.75.75 0 000 1.5h2.5z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" clipRule="evenodd" /><path d="M10 3a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0v-2.5A.75.75 0 0110 3z" /><path d="M10 14a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0v-2.5a.75.75 0 01.75-.75z" /><path d="M14 10a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z" /><path d="M3 10a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5A.75.75 0 013 10z" /></svg>
                                               Gợi ý bài viết (AI)
                                               </>
                                          )}
                                      </button>
                                      <button type="button" onClick={() => setIsPreviewing(true)} disabled={!title || !summary || !imageUrl} className="w-full px-8 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-300 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500">
                                            Xem trước
                                      </button>
                                      <button type="submit" disabled={isSubmitting} className={`w-full px-8 py-3 text-white font-bold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${ editingPost ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'} disabled:bg-gray-500 disabled:cursor-not-allowed`}>
                                          {isSubmitting ? 'Đang xử lý...' : (editingPost ? 'Cập nhật bài viết' : 'Đăng bài')}
                                      </button>
                                      {editingPost && (<button type="button" onClick={resetForm} className="w-full px-8 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-300">Hủy</button>)}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            );
        case 'features':
            return (
                <section>
                    <h2 className="text-3xl font-bold mb-6">Tính năng khác</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                            <h3 className="font-semibold mb-2">Nhập bài viết</h3>
                            <p className="text-sm text-neutral-400 mb-4">Nhập dữ liệu bài viết từ file JSON/CSV.</p>
                            <button className="px-4 py-2 bg-gray-700 rounded-lg">Tải file</button>
                        </div>
                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                            <h3 className="font-semibold mb-2">Xuất bài viết</h3>
                            <p className="text-sm text-neutral-400 mb-4">Tải về bản sao dữ liệu bài viết.</p>
                            <button className="px-4 py-2 bg-gray-700 rounded-lg">Xuất dữ liệu</button>
                        </div>
                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                            <h3 className="font-semibold mb-2">Dọn dẹp bản nháp</h3>
                            <p className="text-sm text-neutral-400 mb-4">Xóa các bài chưa hoàn tất sau 30 ngày.</p>
                            <button className="px-4 py-2 bg-gray-700 rounded-lg">Quét ngay</button>
                        </div>
                    </div>
                </section>
            );
        case 'users':
            return (
                 <section>
                    <h2 className="text-3xl font-bold mb-6">Quản lý Người dùng</h2>
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Danh sách người dùng ({filteredUsers.length})</h3>
                             <div className="relative w-full max-w-xs">
                                <input type="search" placeholder="Tìm người dùng..." value={userSearchQuery} onChange={(e) => setUserSearchQuery(e.target.value)} className="w-full pl-4 pr-4 py-2 text-sm text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500" />
                            </div>
                        </div>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                             {isDataLoading ? (
                                Array.from({ length: 5 }).map((_, index) => <SkeletonListItem key={index} />)
                             ) : filteredUsers.length > 0 ? (filteredUsers.map(user => (
                                <div key={user.id} className="bg-gray-800/50 p-3 rounded-md flex items-center justify-between">
                                    <div>
                                        <span className="font-bold text-white">{user.username}</span>
                                        <span className={`ml-3 text-xs font-semibold px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-purple-500/30 text-purple-300' : 'bg-gray-600/50 text-neutral-300'}`}>{user.role}</span>
                                        <p className="text-xs text-neutral-400 mt-1">Đã tham gia: {user.registeredDate}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">Sửa vai trò</button>
                                         <button className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded hover:bg-red-700">Xóa</button>
                                    </div>
                                </div>
                             ))) : (
                                 <p className="text-neutral-400 text-center py-8">Không tìm thấy người dùng nào.</p>
                             )}
                        </div>
                    </div>
                </section>
            );
    }
  }


  return (
    <div className="bg-gray-950 text-white min-h-screen font-sans">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Trang quản trị</h1>
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Sidebar Navigation */}
          <aside className="md:w-64">
            <nav className="space-y-2 sticky top-28">
               <NavItem 
                    tab="dashboard" 
                    label="Tổng quan" 
                    isActive={activeTab === 'dashboard'}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H9a1 1 0 01-1-1V4zM14 8a1 1 0 011-1h2a1 1 0 011 1v8a1 1 0 01-1 1h-2a1 1 0 01-1-1V8z" /></svg>}
                />
                <NavItem 
                    tab="posts" 
                    label="Quản lý bài viết" 
                    isActive={activeTab === 'posts'}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>}
                />
                <NavItem 
                    tab="create" 
                    label={editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'} 
                    isActive={activeTab === 'create'}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>}
                />
                <NavItem 
                    tab="features" 
                    label="Tính năng khác" 
                    isActive={activeTab === 'features'}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M11.983 1.447a1 1 0 00-1.966 0l-.146 1.175a7.967 7.967 0 00-2.27.939l-.985-.57a1 1 0 00-1.366.366l-1 1.732a1 1 0 00.366 1.366l.985.57c-.173.72-.26 1.474-.26 2.25s.087 1.53.26 2.25l-.985.57a1 1 0 00-.366 1.366l1 1.732a1 1 0 001.366.366l.985-.57c.69.405 1.447.712 2.27.939l.146 1.175a1 1 0 001.966 0l.146-1.175a7.967 7.967 0 002.27-.939l.985.57a1 1 0 001.366-.366l1-1.732a1 1 0 00-.366-1.366l-.985-.57c.173-.72.26-1.474.26-2.25s-.087-1.53-.26-2.25l.985-.57a1 1 0 00.366-1.366l-1-1.732a1 1 0 00-1.366-.366l-.985.57a7.967 7.967 0 00-2.27-.939l-.146-1.175zM10 13a3 3 0 110-6 3 3 0 010 6z" /></svg>}
                />
                <NavItem 
                    tab="users" 
                    label="Quản lý Người dùng" 
                    isActive={activeTab === 'users'}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6.07 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 017 16v1H1.07z" /></svg>}
                />
            </nav>
          </aside>
          
          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
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
                    <p className="text-sm text-neutral-400">bởi {postToDelete.author}</p>
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

export default Admin;