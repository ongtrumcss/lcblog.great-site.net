import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 mt-16 py-8 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-white mb-3">LC Blog</h3>
            <p className="text-neutral-400 text-sm">Khám phá thế giới công nghệ cùng chúng tôi</p>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-white mb-3">Liên hệ</h3>
            <div className="space-y-2 text-sm text-neutral-400">
              <p>📧 letrongchien63@gmail.com</p>
              <p>📱 0986221504</p>
              <p>📍 Việt Nam</p>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-white mb-3">Theo dõi</h3>
            <p className="text-neutral-400 text-sm">Cập nhật những bài viết mới nhất</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 text-center text-neutral-500">
          <p>&copy; {new Date().getFullYear()} LC Blog. Mọi quyền được bảo lưu.</p>
          <p className="text-sm mt-1">Được tạo ra với niềm đam mê công nghệ tại Việt Nam.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;