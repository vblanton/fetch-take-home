export const Spinner = () => (
  <div 
    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
    role="status"
    aria-label="Loading"
  >
    <span className="sr-only">Loading...</span>
  </div>
);

export default Spinner; 