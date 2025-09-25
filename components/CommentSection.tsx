import React, { useState } from 'react';
import { Comment, User } from '../types';

interface CommentSectionProps {
    postId: number;
    comments: Comment[];
    currentUser: User | null;
    onAddComment: (postId: number, content: string) => void;
    onNavigateToLogin: () => void;
}

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

const UserAvatar: React.FC<{ user: { username: string, avatarUrl?: string }, size?: 'small' | 'large' }> = ({ user, size = 'large' }) => {
    const sizeClasses = size === 'large' ? 'h-12 w-12' : 'h-10 w-10';
    return (
        user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.username} className={`${sizeClasses} rounded-full object-cover border-2 border-gray-600`} />
        ) : (
            <span className={`${sizeClasses} rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            </span>
        )
    );
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, comments, currentUser, onAddComment, onNavigateToLogin }) => {
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        
        setIsSubmitting(true);
        onAddComment(postId, newComment);
        
        // Simulate a network request
        setTimeout(() => {
            setNewComment('');
            setIsSubmitting(false);
        }, 300);
    };

    const sortedComments = [...comments].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="mt-16 border-t border-gray-800 pt-12">
            <h2 className="text-3xl font-bold text-white mb-8">{sortedComments.length} Bình luận</h2>
            
            <div className="mb-12">
                {currentUser ? (
                    <form onSubmit={handleSubmit} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <UserAvatar user={currentUser} />
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Viết bình luận của bạn..."
                                className="w-full px-4 py-3 text-base text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300"
                                rows={4}
                                required
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting || !newComment.trim()}
                                className="mt-4 px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="bg-gray-800/50 p-6 rounded-lg text-center border border-gray-700">
                        <p className="text-neutral-300">
                            <button onClick={onNavigateToLogin} className="font-semibold text-purple-400 hover:underline">Đăng nhập</button> hoặc <button onClick={onNavigateToLogin} className="font-semibold text-purple-400 hover:underline">đăng ký</button> để tham gia bình luận.
                        </p>
                    </div>
                )}
            </div>

            <div className="space-y-8">
                {sortedComments.length > 0 ? (
                    sortedComments.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <UserAvatar user={{ username: comment.username, avatarUrl: comment.avatarUrl }} size="small" />
                            </div>
                            <div className="flex-1 bg-gray-900 p-4 rounded-lg border border-gray-800">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-white">{comment.username}</span>
                                    <span className="text-xs text-neutral-500">{formatTimeAgo(comment.timestamp)}</span>
                                </div>
                                <p className="text-neutral-300 whitespace-pre-wrap">{comment.content}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-neutral-500 py-8">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                )}
            </div>
        </div>
    );
};

export default CommentSection;
