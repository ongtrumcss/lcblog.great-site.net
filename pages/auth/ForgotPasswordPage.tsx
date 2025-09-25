import React, { useState } from 'react';

interface ForgotPasswordPageProps {
    onNavigateToLogin: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigateToLogin }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(`Nếu tài khoản với email ${email} tồn tại, một liên kết đặt lại mật khẩu đã được gửi.`);
        setEmail('');
    };

    return (
        <main className="container mx-auto px-4 py-16 flex justify-center items-center">
            <div className="w-full max-w-md">
                <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-lg">
                    <h1 className="text-3xl font-bold text-center text-white mb-6">Quên mật khẩu</h1>
                    {message ? (
                        <p className="bg-green-900/50 text-green-300 text-center p-3 rounded-md mb-4">{message}</p>
                    ) : (
                        <p className="text-neutral-400 text-center mb-6">Nhập email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.</p>
                    )}
                    {!message && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                    autoFocus
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-300"
                            >
                                Gửi liên kết đặt lại
                            </button>
                        </form>
                    )}
                    <p className="text-center text-neutral-400 mt-6">
                        Nhớ mật khẩu rồi? <button onClick={onNavigateToLogin} className="font-semibold text-purple-400 hover:underline">Đăng nhập</button>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default ForgotPasswordPage;
