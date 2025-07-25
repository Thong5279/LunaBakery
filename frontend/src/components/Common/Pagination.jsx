import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  hasNextPage, 
  hasPrevPage,
  className = ""
}) => {
  if (totalPages <= 1) return null;

  // Tính toán hasNextPage và hasPrevPage nếu không được truyền vào
  const hasNext = hasNextPage !== undefined ? hasNextPage : currentPage < totalPages;
  const hasPrev = hasPrevPage !== undefined ? hasPrevPage : currentPage > 1;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Hiển thị tất cả trang nếu tổng số trang <= 5
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logic hiển thị trang thông minh
      if (currentPage <= 3) {
        // Trang đầu: hiển thị 1, 2, 3, 4, 5
        for (let i = 1; i <= maxVisiblePages; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        // Trang cuối: hiển thị 5 trang cuối
        for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Trang giữa: hiển thị 2 trang trước và 2 trang sau
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  return (
    <div className={`flex items-center justify-center mt-8 mb-4 ${className}`}>
      <div className="flex items-center space-x-3">
        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            hasPrev
              ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
          }`}
        >
          <FaChevronLeft className="w-4 h-4" />
          <span>Trước</span>
        </button>
        
        {/* Page Numbers */}
        <div className="flex items-center space-x-2">
          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                pageNum === currentPage
                  ? 'bg-pink-500 text-white border-pink-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
        
        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            hasNext
              ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
          }`}
        >
          <span>Sau</span>
          <FaChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination; 