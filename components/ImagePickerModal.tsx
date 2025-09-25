import React, { useState, useRef } from 'react';
import Modal from './Modal';

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (url: string) => void;
}

const validateImageUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
        if (!url) {
            resolve(false);
            return;
        }
        try {
            const parsedUrl = new URL(url);
            if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
                resolve(false);
                return;
            }
        } catch (_) {
            resolve(false);
            return;
        }

        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
};


const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const ImagePickerModal: React.FC<ImagePickerModalProps> = ({ isOpen, onClose, onImageSelect }) => {
    const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
    const [url, setUrl] = useState('');
    const [urlPreview, setUrlPreview] = useState('');
    const [urlError, setUrlError] = useState('');
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);
    const [isCheckingUrl, setIsCheckingUrl] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
        if (urlPreview) setUrlPreview(''); // Reset preview if user types again
        if (urlError) setUrlError('');
    };

    const handleUrlPreview = async () => {
        setUrlError('');
        if (!url) {
            setUrlError('Vui lòng nhập URL.');
            return;
        }
        setIsCheckingUrl(true);
        const isValid = await validateImageUrl(url);
        if (isValid) {
            setUrlPreview(url);
        } else {
            setUrlError('URL hình ảnh không hợp lệ hoặc không thể truy cập.');
        }
        setIsCheckingUrl(false);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('Kích thước tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 5MB.');
                return;
            }
            const base64 = await fileToBase64(file);
            setUploadPreview(base64);
        }
    };
    
    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('Kích thước tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 5MB.');
                return;
            }
            const base64 = await fileToBase64(file);
            setUploadPreview(base64);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };


    const handleConfirm = async () => {
        if (activeTab === 'url' && urlPreview) {
            onImageSelect(urlPreview);
            resetAndClose();
        } else if (activeTab === 'upload' && uploadPreview) {
            onImageSelect(uploadPreview);
            resetAndClose();
        }
    };

    const resetAndClose = () => {
        setUrl('');
        setUrlPreview('');
        setUrlError('');
        setUploadPreview(null);
        setActiveTab('url'); // Reset to default tab
        onClose();
    };

    const canConfirm = (activeTab === 'url' && !!urlPreview) || (activeTab === 'upload' && !!uploadPreview);

    return (
        <Modal isOpen={isOpen} onClose={resetAndClose} title="Chọn hình ảnh bài viết">
            <div className="flex border-b border-gray-700 mb-6">
                <button
                    onClick={() => setActiveTab('url')}
                    className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'url' ? 'border-b-2 border-purple-500 text-white' : 'text-neutral-400 hover:text-white'}`}
                >
                    Từ URL
                </button>
                <button
                    onClick={() => setActiveTab('upload')}
                    className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'upload' ? 'border-b-2 border-purple-500 text-white' : 'text-neutral-400 hover:text-white'}`}
                >
                    Tải lên
                </button>
            </div>

            {activeTab === 'url' && (
                <div className="space-y-4 min-h-[300px]">
                    <label htmlFor="imageUrlInput" className="block text-sm font-medium text-neutral-300">Dán URL hình ảnh vào đây</label>
                    <div className="flex gap-2">
                        <input
                            id="imageUrlInput"
                            type="url"
                            value={url}
                            onChange={handleUrlChange}
                            placeholder="https://example.com/image.png"
                            className="flex-grow px-3 py-2 text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button onClick={handleUrlPreview} disabled={isCheckingUrl} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-500 disabled:cursor-wait">
                            {isCheckingUrl ? 'Đang kiểm tra...' : 'Xem trước'}
                        </button>
                    </div>
                    {urlError && <p className="text-red-400 text-xs mt-1">{urlError}</p>}
                    {urlPreview && (
                        <div className="mt-4 border border-gray-700 rounded-lg p-2">
                            <p className="text-sm text-neutral-400 mb-2">Xem trước:</p>
                            <img src={urlPreview} alt="Xem trước URL" className="max-w-full max-h-64 mx-auto rounded-md object-contain bg-black/20" />
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'upload' && (
                 <div className="space-y-4 min-h-[300px] flex flex-col items-center justify-center">
                    <input type="file" accept="image/png, image/jpeg, image/gif, image/webp" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    
                    {uploadPreview ? (
                         <div className="border border-gray-700 rounded-lg p-2 w-full text-center">
                            <p className="text-sm text-neutral-400 mb-2">Xem trước:</p>
                            <img src={uploadPreview} alt="Xem trước tệp tải lên" className="max-w-full max-h-64 mx-auto rounded-md object-contain bg-black/20" />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-4 px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors text-sm"
                            >
                                Chọn tệp khác
                            </button>
                        </div>
                    ) : (
                         <div 
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-48 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800/50 hover:border-purple-500 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h.586a1 1 0 01.707.293l.414.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l.414-.414A1 1 0 0116.414 3H17a4 4 0 014 4v5a4 4 0 01-4 4H7z" /></svg>
                            <p className="text-neutral-400">Kéo và thả tệp vào đây</p>
                            <p className="text-neutral-500 text-sm">hoặc</p>
                            <p className="text-purple-400 font-semibold">Nhấn để chọn tệp</p>
                            <p className="text-xs text-neutral-600 mt-2">PNG, JPG, GIF, WEBP (tối đa 5MB)</p>
                        </div>
                    )}
                </div>
            )}

            <div className="flex justify-end items-center mt-8 pt-4 border-t border-gray-700 space-x-3">
                <button onClick={resetAndClose} className="py-2 px-5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors">Hủy</button>
                <button onClick={handleConfirm} disabled={!canConfirm} className="py-2 px-5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">Xác nhận & Sử dụng ảnh</button>
            </div>
        </Modal>
    );
};

export default ImagePickerModal;
