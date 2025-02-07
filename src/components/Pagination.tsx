import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const navigate = useNavigate();

  const handlePageChange = (page: number) => {
    navigate(`?page=${page}`);
    if (onPageChange) onPageChange(page);
  };

  return (
    <div className="pagination-controls">
      {currentPage > 1 && (
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="pagination-button"
        >
          Previos
        </button>
      )}
      <span className="page-info">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages && (
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="pagination-button"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;
