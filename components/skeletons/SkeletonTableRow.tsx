import React from 'react';

const SkeletonTableRow: React.FC = () => {
    return (
        <tr className="bg-gray-900 border-b border-gray-800 animate-pulse" aria-hidden="true">
            <td className="px-4 py-4">
                <div className="h-5 bg-gray-700/50 rounded w-11/12"></div>
            </td>
            <td className="px-4 py-4">
                <div className="h-5 bg-gray-700/50 rounded w-3/4"></div>
            </td>
            <td className="px-4 py-4">
                <div className="h-5 bg-gray-700/50 rounded w-full"></div>
            </td>
            <td className="px-4 py-4">
                <div className="h-5 bg-gray-700/50 rounded w-5/6"></div>
            </td>
            <td className="px-4 py-4">
                <div className="flex justify-end items-center space-x-2">
                    <div className="h-6 w-10 bg-gray-700/50 rounded-md"></div>
                    <div className="h-6 w-10 bg-gray-700/50 rounded-md"></div>
                    <div className="h-6 w-10 bg-gray-700/50 rounded-md"></div>
                </div>
            </td>
        </tr>
    );
}

export default SkeletonTableRow;
