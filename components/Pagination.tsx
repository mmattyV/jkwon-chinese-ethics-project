import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  sortBy?: string
}

export default function Pagination({ currentPage, totalPages, sortBy = 'hot' }: PaginationProps) {
  const pages = []
  
  // Generate page numbers to display
  for (let i = 1; i <= totalPages; i++) {
    // Show first page, last page, current page, and pages around current
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 2 && i <= currentPage + 2)
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }
  
  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {currentPage > 1 && (
        <Link
          href={`/?page=${currentPage - 1}&sort=${sortBy}`}
          className="btn-outline"
        >
          Previous
        </Link>
      )}
      
      {pages.map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={`/?page=${page}&sort=${sortBy}`}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              page === currentPage
                ? 'bg-cerulean-500 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {page}
          </Link>
        )
      ))}
      
      {currentPage < totalPages && (
        <Link
          href={`/?page=${currentPage + 1}&sort=${sortBy}`}
          className="btn-outline"
        >
          Next
        </Link>
      )}
    </div>
  )
}

