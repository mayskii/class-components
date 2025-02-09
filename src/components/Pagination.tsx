import React, { useEffect, useState } from 'react';
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
  const [inputPage, setInputPage] = useState(currentPage);

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      if (onPageChange) {
        onPageChange(page);
      }
      navigate(`?page=${page}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInputPage(value ? parseInt(value, 10) : 1);
    }
  };

  const handleInputSubmit = () => {
    if (inputPage >= 1 && inputPage <= totalPages) {
      handlePageChange(inputPage);
    }
  };

  return (
    <div className="pagination-controls">
      {currentPage > 1 && (
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="pagination-button"
        >
          Previous
        </button>
      )}

      <input
        type="number"
        value={inputPage}
        onChange={handleInputChange}
        onBlur={handleInputSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleInputSubmit();
        }}
        className="page-input"
        min={1}
        max={totalPages}
      />
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
