export function ArticleCardSkeleton() {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-300"></div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-6 bg-gray-300 rounded w-16 ml-2"></div>
          </div>
          <div className="space-y-2 mb-3">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="h-3 bg-gray-300 rounded w-1/3"></div>
            <div className="h-3 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }
  
  export function FeedLoadingSkeleton() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  
  export function SearchLoadingSkeleton() {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[...Array(3)].map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }
  
  export function CategoryLoadingSkeleton() {
    return (
      <div className="space-y-6">
        <div className="flex gap-2 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-300 rounded-full"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }
  