import React, { useState } from 'react';

interface ContactPageProps {
    addToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ addToast }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Mô phỏng việc gửi biểu mẫu
        setTimeout(() => {
            setIsSubmitting(false);
            addToast('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.', 'success');
            // Đặt lại biểu mẫu
            setName('');
            setEmail('');
            setMessage('');
        }, 1000);
    };

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                    Liên hệ với chúng tôi
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-neutral-300">
                    Chúng tôi rất mong nhận được phản hồi từ bạn! Hãy cho chúng tôi biết suy nghĩ, câu hỏi hoặc đề xuất của bạn.
                </p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-gray-900 p-8 rounded-xl border border-gray-800">
                {/* Contact Form */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Gửi tin nhắn</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">Tên của bạn</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-neutral-300 mb-2">Tin nhắn của bạn</label>
                            <textarea
                                id="message"
                                rows={5}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full px-4 py-3 text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-300 disabled:bg-purple-800 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                        </button>
                    </form>
                </div>
                {/* Contact Info */}
                <div className="bg-gray-800/50 p-8 rounded-lg">
                    <h2 className="text-2xl font-bold text-white mb-6">Thông tin liên hệ</h2>
                    <div className="space-y-6 text-neutral-300">
                        <div className="flex items-start">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-4 text-purple-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                             <div>
                                <h3 className="font-semibold text-white">Địa chỉ</h3>
                                <p>Việt Nam</p>
                             </div>
                        </div>
                         <div className="flex items-start">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-4 text-purple-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                             <div>
                                <h3 className="font-semibold text-white">Email</h3>
                                <p>letrongchien63@gmail.com</p>
                             </div>
                        </div>
                         <div className="flex items-start">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-4 text-purple-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                             <div>
                                <h3 className="font-semibold text-white">Điện thoại</h3>
                                <p>0986221504</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ContactPage;
