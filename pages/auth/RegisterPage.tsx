import React, { useState } from 'react';

interface RegisterPageProps {
    onRegister: (username: string, password: string) => boolean;
    onNavigateToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onNavigateToLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }
        if(password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        const success = onRegister(username, password);
        if (!success) {
            setError('Tên đăng nhập đã tồn tại.');
        }
    };

    return (
        <main className="container mx-auto px-4 py-16 flex justify-center items-center">
            <div className="w-full max-w-md">
                <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-lg">
                    <h1 className="text-3xl font-bold text-center text-white mb-6">Tạo tài khoản</h1>
                    {error && <p className="bg-red-900/50 text-red-300 text-center p-3 rounded-md mb-4">{error}</p>}
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
                         <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300 mb-2">Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-300"
                        >
                            Đăng ký
                        </button>
                    </form>
                     <p className="text-center text-neutral-400 mt-6">
                        Đã có tài khoản? <button onClick={onNavigateToLogin} className="font-semibold text-purple-400 hover:underline">Đăng nhập</button>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default RegisterPage;
