import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/useTheme';

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
  const { theme } = useTheme();

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
          className={`pagination-button ${theme}`}
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
        className={`page-input ${theme}`}
        min={1}
        max={totalPages}
      />
      <span className={`page-info ${theme}`}>
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages && (
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className={`pagination-button ${theme}`}
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;
