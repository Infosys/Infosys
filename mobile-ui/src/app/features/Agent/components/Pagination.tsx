// Pagination component displays page navigation controls for lists with multiple pages.
// Used in Agent screens to navigate between paginated data sets.
import React from "react";
import "../../../../styles/Pagination.css";

// Props for Pagination:
//   - page: current page number
//   - totalPages: total number of pages
//   - onPageChange: callback for changing page
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  // Only show pagination controls if there are at least 2 pages
  if (totalPages < 2) return null;

  return (
    <div className="custom-pagination">
      {/* Left Arrow: go to previous page, disabled on first page */}
      <button
        className="arrow"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        &lt;
      </button>
      {/* Current page indicator */}
      <button className="page current">{page}</button>
      {/* Next page button, shown if not on last page */}
      {page < totalPages && (
        <button className="page" onClick={() => onPageChange(page + 1)}>
          {page + 1}
        </button>
      )}

      {/* Ellipsis and last page button, shown if more than one page ahead */}
      {page < totalPages - 1 && (
        <>
          <span className="ellipsis">...</span>
          <button className="page" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      {/* Right Arrow: go to next page, disabled on last page */}
      <button
        className="arrow"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        &gt;
      </button>
    </div>
  );
};

// Export Pagination for use in Agent screens
export default Pagination;