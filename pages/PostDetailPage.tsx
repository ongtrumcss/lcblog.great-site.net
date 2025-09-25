import React from 'react';
import { Post, User, Comment } from '../types';
import AIEnhancedContent from '../components/AIEnhancedContent';
import CommentSection from '../components/CommentSection';
import ReadingProgress from '../components/ReadingProgress';
import SocialShare from '../components/SocialShare';

interface PostDetailPageProps {
    post: Post;
    onNavigateBack: () => void;
    currentUser: User | null;
    comments: Comment[];
    onAddComment: (postId: number, content: string) => void;
    onNavigateToLogin: () => void;
}

const PostDetailPage: React.FC<PostDetailPageProps> = ({ post, onNavigateBack, currentUser, comments, onAddComment, onNavigateToLogin }) => {
    // Sử dụng `summary` làm nội dung chính để minh họa
    const mainContent = post.summary + "\n\n" + "Đây là nơi nội dung đầy đủ của bài viết sẽ được hiển thị. Hiện tại, chúng tôi đang sử dụng phần tóm tắt để minh họa cho tính năng này. Hãy tưởng tượng đây là một bài phân tích sâu sắc với nhiều đoạn văn, hình ảnh và chi tiết kỹ thuật hơn.";

    return (
        <>
            <ReadingProgress />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
                <div className="max-w-4xl mx-auto">
                    <button onClick={onNavigateBack} className="text-purple-400 hover:text-purple-300 transition-colors mb-8 flex items-center group">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                         <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                       </svg>
                       Quay lại
                    </button>

                <article>
                    <header>
                         <div className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-600/50 text-purple-300 inline-block mb-4">
                            {post.category}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">{post.title}</h1>
                        <div className="text-md text-neutral-400 flex items-center space-x-4">
                            <span>Bởi <strong>{post.author}</strong></span>
                            <span>&bull;</span>
                            <span>{post.date}</span>
                        </div>
                    </header>

                    <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-[500px] object-cover rounded-xl my-8 bg-gray-800 border border-gray-800" />
                    
                    <div className="prose prose-invert prose-lg max-w-none text-neutral-300 leading-relaxed prose-p:my-4 prose-headings:text-white">
                      {mainContent.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>

                </article>

                <AIEnhancedContent post={post} />

                <CommentSection
                    postId={post.id}
                    comments={comments}
                    currentUser={currentUser}
                    onAddComment={onAddComment}
                    onNavigateToLogin={onNavigateToLogin}
                />
            </div>
        </main>
        <style>{`
            @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        `}</style>
        </>
    );
}

export default PostDetailPage;
