import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface UserProfilePageProps {
    currentUser: User;
    onUpdateProfile: (userId: number, newUsername: string, newPassword?: string, newAvatarUrl?: string) => boolean;
    onNavigateBack: () => void;
}

const AVATAR_OPTIONS = [
    'https://picsum.photos/seed/avatar1/100/100',
    'https://picsum.photos/seed/avatar2/100/100',
    'https://picsum.photos/seed/avatar3/100/100',
    'https://picsum.photos/seed/avatar4/100/100',
    'https://picsum.photos/seed/avatar5/100/100',
    'https://picsum.photos/seed/avatar6/100/100',
];

const UserProfilePage: React.FC<UserProfilePageProps> = ({ currentUser, onUpdateProfile, onNavigateBack }) => {
    const [username, setUsername] = useState(currentUser.username);
    const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatarUrl || AVATAR_OPTIONS[0]);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            setIsSubmitting(false);
            return;
        }
        if (newPassword && newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
            setIsSubmitting(false);
            return;
        }

        const success = onUpdateProfile(currentUser.id, username, newPassword || undefined, selectedAvatar);
        
        if (!success) {
            setError('Tên người dùng đã được sử dụng. Vui lòng chọn một tên khác.');
        }
        
        setIsSubmitting(false);
    };

    return (
        <main className="container mx-auto px-4 py-16 flex justify-center items-center">
            <div className="w-full max-w-3xl">
                <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-lg">
                    <h1 className="text-3xl font-bold text-center text-white mb-8">Hồ sơ của bạn</h1>
                    {error && <p className="bg-red-900/50 text-red-300 text-center p-3 rounded-md mb-6">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* Section 1: Account Information */}
                        <div className="bg-gray-800/50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-3">Thông tin tài khoản</h2>
                            <div className="space-y-6 pt-4">
                                {/* Avatar Section */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-4">Ảnh đại diện</label>
                                    <div className="flex items-center flex-col sm:flex-row gap-6">
                                        <img src={selectedAvatar} alt="Ảnh đại diện hiện tại" className="h-24 w-24 rounded-full object-cover border-4 border-gray-700 flex-shrink-0" />
                                        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                                            {AVATAR_OPTIONS.map(avatar => (
                                                <button
                                                    type="button"
                                                    key={avatar}
                                                    onClick={() => setSelectedAvatar(avatar)}
                                                    className={`h-14 w-14 rounded-full overflow-hidden transition-all duration-200 ${selectedAvatar === avatar ? 'ring-4 ring-purple-500' : 'ring-2 ring-transparent hover:ring-gray-600'}`}
                                                    aria-label={`Chọn avatar ${avatar}`}
                                                >
                                                    <img src={avatar} alt="Tùy chọn avatar" className="h-full w-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Username Section */}
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-neutral-300 mb-2">Tên đăng nhập</label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full max-w-sm px-4 py-3 text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Security Settings */}
                        <div className="bg-gray-800/50 p-6 rounded-lg">
                             <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-3">Cài đặt bảo mật</h2>
                             <div className="space-y-4 pt-4">
                                <p className="text-sm text-neutral-400">Để trống các trường mật khẩu nếu bạn không muốn thay đổi.</p>
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-300 mb-2">Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full max-w-sm px-4 py-3 text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        autoComplete="new-password"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300 mb-2">Xác nhận mật khẩu mới</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full max-w-sm px-4 py-3 text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end space-x-4 pt-4">
                             <button
                                type="button"
                                onClick={onNavigateBack}
                                className="py-2 px-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-300"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="py-2 px-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-300 disabled:bg-purple-800 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default UserProfilePage;
