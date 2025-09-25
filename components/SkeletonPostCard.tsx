import React from 'react';

const SkeletonPostCard: React.FC = () => {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 flex flex-col animate-pulse" aria-hidden="true">
      {/* Image Placeholder */}
      <div className="w-full h-48 bg-gray-700/50"></div>
      <div className="p-6 flex flex-col flex-grow">
        {/* Title Placeholder */}
        <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-4"></div>
        {/* Meta Placeholder */}
        <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-6"></div>
        {/* Summary Placeholder */}
        <div className="space-y-3 flex-grow">
          <div className="h-4 bg-gray-700/50 rounded"></div>
          <div className="h-4 bg-gray-700/50 rounded"></div>
          <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
        </div>
        {/* Read More Placeholder */}
        <div className="mt-6 h-5 bg-gray-700/50 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export default SkeletonPostCard;