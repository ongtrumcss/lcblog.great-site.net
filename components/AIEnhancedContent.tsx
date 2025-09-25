import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Post } from '../types';

const API_KEY = process.env.API_KEY;

interface AIEnhancedContentProps {
  post: Post;
}

const AIEnhancedContent: React.FC<AIEnhancedContentProps> = ({ post }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!API_KEY || API_KEY === 'undefined' || API_KEY === '') {
      setError("Chức năng AI không khả dụng. Vui lòng cấu hình API key trong file .env.local");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const prompt = `Dựa trên bài viết công nghệ có tiêu đề "${post.title}" và tóm tắt "${post.summary}", hãy tạo ra 3 chủ đề liên quan để tìm hiểu chuyên sâu hơn. Với mỗi chủ đề, hãy:
      1. Đặt một tiêu đề con hấp dẫn.
      2. Cung cấp một đoạn giải thích ngắn gọn (khoảng 2-4 câu) về tầm quan trọng hoặc sự thú vị của chủ đề đó.
      
      Vui lòng trả lời bằng tiếng Việt và định dạng kết quả dưới dạng markdown. Sử dụng tiêu đề cấp 3 (###) cho mỗi chủ đề.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setGeneratedContent(response.text);
    } catch (e: any) {
      console.error("Error generating content:", e);
      if (e?.message?.includes('API key not valid')) {
        setError("API key không hợp lệ. Vui lòng kiểm tra lại API key trong file .env.local");
      } else if (e?.message?.includes('INVALID_ARGUMENT')) {
        setError("API key không đúng định dạng. Vui lòng kiểm tra lại API key.");
      } else {
        setError("Rất tiếc, đã có lỗi xảy ra khi tạo nội dung. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formattedContent = generatedContent
    ?.replace(/### (.*)/g, '<h3 class="text-xl font-bold text-purple-300 mt-6 mb-2">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    || '';

  return (
    <div className="bg-gray-900/70 mt-12 p-8 rounded-xl border border-dashed border-gray-700 text-center backdrop-blur-sm">
      <div className="max-w-3xl mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-purple-400 mb-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M11.25 9.75a.75.75 0 000-1.5h-2.5a.75.75 0 000 1.5h2.5z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" clipRule="evenodd" />
          <path d="M10 3a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0v-2.5A.75.75 0 0110 3z" /><path d="M10 14a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0v-2.5a.75.75 0 01.75-.75z" /><path d="M14 10a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z" /><path d="M3 10a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5A.75.75 0 013 10z" />
        </svg>
        <h2 className="text-2xl font-bold text-white mb-2">Đào sâu kiến thức với AI</h2>
        <p className="text-neutral-400 mb-6">
          Nhấn nút bên dưới để AI phân tích bài viết và đề xuất các chủ đề nâng cao, giúp bạn mở rộng hiểu biết.
        </p>

        {!isLoading && !generatedContent && (
          <button
            onClick={handleGenerate}
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500"
          >
            Tạo chủ đề nâng cao
          </button>
        )}
        
        {isLoading && (
          <div className="text-center text-neutral-300 p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-3"></div>
            <p>AI đang phân tích và tạo nội dung...</p>
          </div>
        )}

        {error && (
            <div className="text-red-400 bg-red-900/20 p-4 rounded-lg">
                <p>{error}</p>
                <button onClick={handleGenerate} className="mt-4 px-4 py-2 text-sm bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors">Thử lại</button>
            </div>
        )}

        {generatedContent && (
          <div className="mt-6 text-left p-6 bg-gray-800/50 rounded-lg border border-gray-700 transition-opacity duration-500 animate-fade-in">
            <div
              className="prose prose-invert prose-p:text-neutral-300 prose-p:leading-relaxed max-w-none"
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />
            <button onClick={handleGenerate} className="mt-6 px-4 py-2 text-sm bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors">Tạo lại</button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AIEnhancedContent;
