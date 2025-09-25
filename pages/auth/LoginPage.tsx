import React, { useState } from 'react';

interface LoginPageProps {
    onLogin: (username: string, password: string) => boolean;
    onNavigateToRegister: () => void;
    onNavigateToForgotPassword: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToRegister, onNavigateToForgotPassword }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(username, password);
    };

    return (
        <main className="container mx-auto px-4 py-16 flex justify-center items-center">
            <div className="w-full max-w-md">
                <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-lg">
                    <h1 className="text-3xl font-bold text-center text-white mb-6">Đăng nhập</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-neutral-300 mb-2">Tên đăng nhập</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                                autoFocus
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">Mật khẩu</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>
                         <div className="text-right">
                            <button type="button" onClick={onNavigateToForgotPassword} className="text-sm text-purple-400 hover:underline">Quên mật khẩu?</button>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-300"
                        >
                            Đăng nhập
                        </button>
                    </form>
                    <p className="text-center text-neutral-400 mt-6">
                        Chưa có tài khoản? <button onClick={onNavigateToRegister} className="font-semibold text-purple-400 hover:underline">Đăng ký ngay</button>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;
