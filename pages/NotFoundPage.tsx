import React from 'react';

interface NotFoundPageProps {
    onNavigateHome: () => void;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigateHome }) => {
    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col justify-center items-center text-center min-h-[calc(100vh-10rem)]">
            <h1 className="text-8xl md:text-9xl font-extrabold tracking-tighter mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-600">
                    404
                </span>
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Trang không tồn tại
            </h2>
            <p className="max-w-md mx-auto text-lg text-neutral-400 mb-8">
                Rất tiếc, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Có thể trang đã bị xóa hoặc URL đã bị thay đổi.
            </p>
            <button
                onClick={onNavigateHome}
                className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-purple-500"
            >
                Quay về Trang chủ
            </button>
        </main>
    );
};

export default NotFoundPage;
