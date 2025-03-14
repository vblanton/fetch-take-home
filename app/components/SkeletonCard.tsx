export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
      
      {/* Name placeholder */}
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      
      {/* Breed placeholder */}
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      
      {/* Age placeholder */}
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
      
      {/* Location/Distance placeholder */}
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  );
} 