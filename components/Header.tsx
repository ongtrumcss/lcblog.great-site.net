import React, { useState, useRef, useEffect } from 'react';
import { User, Page } from '../types';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  currentPage: Page;
  currentUser: User | null;
  onLogout: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
  onNavigateHome: () => void;
  onNavigateToPosts: () => void;
  onNavigateToAbout: () => void;
  onNavigateToContact: () => void;
  onNavigateToAdminTest: () => void;
  onNavigateToProfile: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, currentUser, onLogout, onNavigateToDashboard, onNavigateToLogin, onNavigateToRegister, onNavigateHome, onNavigateToPosts, onNavigateToAbout, onNavigateToContact, onNavigateToAdminTest, onNavigateToProfile }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const UserAvatar: React.FC<{ user: User }> = ({ user }) => (
    user.avatarUrl ? (
      <img src={user.avatarUrl} alt={user.username} className="h-8 w-8 rounded-full object-cover border-2 border-gray-600" />
    ) : (
      <span className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </span>
    )
  );

  const navLinkClasses = (page: Page) => {
    const baseClasses = "transition-colors duration-200";
    const activeClasses = "text-white font-semibold";
    const inactiveClasses = "text-neutral-300 hover:text-white";
    return `${baseClasses} ${currentPage === page ? activeClasses : inactiveClasses}`;
  };


  return (
    <header className="bg-gray-950/80 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button onClick={onNavigateHome} className="flex items-center" aria-label="Về trang chủ">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <span className="ml-3 text-2xl font-bold text-white">LC</span>
          </button>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={onNavigateHome} className={navLinkClasses('home')}>Trang chủ</button>
            <button onClick={onNavigateToPosts} className={navLinkClasses('posts')}>Bài viết</button>
            <button onClick={onNavigateToAbout} className={navLinkClasses('about')}>Giới thiệu</button>
            <button onClick={onNavigateToContact} className={navLinkClasses('contact')}>Liên hệ</button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
           <div className="flex items-center space-x-4">
            <ThemeToggle />
            {currentUser ? (
              <div className="relative" ref={menuRef}>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-3">
                   <UserAvatar user={currentUser} />
                   <span className="font-semibold hidden sm:inline">{currentUser.username}</span>
                   <svg className={`w-4 h-4 transition-transform text-neutral-400 ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {isMenuOpen && (
                   <div className="absolute right-0 mt-2 w-48 bg-gray-800 dark:bg-gray-700 rounded-md shadow-lg py-1 border border-gray-700 dark:border-gray-600">
                      <button onClick={() => { onNavigateToDashboard(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-neutral-200 dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-600">Bảng điều khiển</button>
                      <button onClick={() => { onNavigateToProfile(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-neutral-200 dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-600">Hồ sơ</button>
                      <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-neutral-200 dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-600">Đăng xuất</button>
                   </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                 <button onClick={onNavigateToAdminTest} className="px-4 py-2 text-sm bg-transparent border border-yellow-500 text-yellow-400 font-semibold rounded-md hover:bg-yellow-500 hover:text-white transition-colors duration-300">
                    Test Trang Quản trị
                 </button>
                 <button onClick={onNavigateToLogin} className="px-4 py-2 text-sm bg-transparent border border-purple-500 text-purple-400 font-semibold rounded-md hover:bg-purple-500 hover:text-white transition-colors duration-300">
                    Đăng nhập
                 </button>
                 <button onClick={onNavigateToRegister} className="px-4 py-2 text-sm bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors duration-300">
                    Đăng ký
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 dark:bg-gray-800 border-t border-gray-800 dark:border-gray-700">
          <div className="px-4 py-2 space-y-1">
            <button
              onClick={() => { onNavigateHome(); setIsMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${navLinkClasses('home')}`}
            >
              Trang chủ
            </button>
            <button
              onClick={() => { onNavigateToPosts(); setIsMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${navLinkClasses('posts')}`}
            >
              Bài viết
            </button>
            <button
              onClick={() => { onNavigateToAbout(); setIsMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${navLinkClasses('about')}`}
            >
              Giới thiệu
            </button>
            <button
              onClick={() => { onNavigateToContact(); setIsMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${navLinkClasses('contact')}`}
            >
              Liên hệ
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;