import React from 'react';

const SkeletonListItem: React.FC = () => {
  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex items-center justify-between animate-pulse" aria-hidden="true">
      <div className="flex-1 min-w-0">
        <div className="h-5 bg-gray-700/50 rounded w-3/5 mb-2"></div>
        <div className="h-4 bg-gray-700/50 rounded w-2/5"></div>
      </div>
      <div className="flex-shrink-0 ml-4 flex items-center space-x-2">
        <div className="h-8 w-16 bg-gray-700/50 rounded-md"></div>
        <div className="h-8 w-16 bg-gray-700/50 rounded-md"></div>
      </div>
    </div>
  );
};

export default SkeletonListItem;
