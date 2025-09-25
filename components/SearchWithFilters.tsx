import React, { useState } from 'react';
import { PostCategory } from '../types';

interface SearchWithFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: PostCategory | 'all';
  onCategoryChange: (category: PostCategory | 'all') => void;
  sortBy: 'newest' | 'oldest' | 'title';
  onSortChange: (sort: 'newest' | 'oldest' | 'title') => void;
}

const SearchWithFilters: React.FC<SearchWithFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const categories: (PostCategory | 'all')[] = ['all', ...Object.values(PostCategory)];

  const categoryLabels: Record<PostCategory | 'all', string> = {
    'all': 'Tất cả danh mục',
    [PostCategory.AI]: "Trí tuệ nhân tạo",
    [PostCategory.WebDev]: "Phát triển Web",
    [PostCategory.Mobile]: "Di động",
    [PostCategory.Cybersecurity]: "An ninh mạng",
    [PostCategory.Hardware]: "Phần cứng",
    [PostCategory.Cloud]: "Điện toán đám mây",
  };

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' },
    { value: 'title', label: 'Theo tên' }
  ] as const;

  return (
    <div className="bg-gray-900 dark:bg-gray-800 p-6 rounded-xl border border-gray-800 dark:border-gray-700 mb-8">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm bài viết..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-gray-200 bg-gray-800 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Filters Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
        >
          <svg
            className={`h-5 w-5 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span>Bộ lọc</span>
        </button>

        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Xóa tìm kiếm
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {isFiltersOpen && (
        <div className="mt-4 pt-4 border-t border-gray-800 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Danh mục
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value as PostCategory | 'all')}
                className="w-full px-3 py-2 text-gray-200 bg-gray-800 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabels[category]}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sắp xếp
              </label>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest' | 'title')}
                className="w-full px-3 py-2 text-gray-200 bg-gray-800 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchWithFilters;
