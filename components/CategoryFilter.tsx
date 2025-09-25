import React from 'react';
import { PostCategory } from '../types';

interface CategoryFilterProps {
  selectedCategory: PostCategory | 'all';
  setSelectedCategory: (category: PostCategory | 'all') => void;
}

const categories: (PostCategory | 'all')[] = ['all', ...Object.values(PostCategory)];

const categoryLabels: Record<PostCategory | 'all', string> = {
    'all': 'Tất cả danh mục',
    [PostCategory.AI]: "Trí tuệ nhân tạo",
    [PostCategory.WebDev]: "Phát triển Web",
    [PostCategory.Mobile]: "Di động",
    [PostCategory.Cybersecurity]: "An ninh mạng",
    [PostCategory.Hardware]: "Phần cứng",
    [PostCategory.Cloud]: "Điện toán đám mây",
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <div className="flex justify-center mb-16">
      <div className="relative w-full max-w-xs">
        <label htmlFor="category-select" className="sr-only">Lọc theo danh mục</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as PostCategory | 'all')}
          className="w-full px-4 py-3 text-base text-neutral-200 bg-gray-800 border border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-300 cursor-pointer"
        >
          {categories.map(category => (
            <option key={category} value={category} className="bg-gray-800 text-neutral-200">
              {categoryLabels[category]}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
