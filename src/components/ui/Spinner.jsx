export default function Spinner({ size = "md" }) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4"
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[1]}`}>
      <div className={`absolute inset-0 rounded-full border-t-primary border-r-primary border-b-transparent border-l-transparent animate-spin ${sizeClasses[size].split(' ')[2]}`}></div>
      <div className={`absolute inset-0 rounded-full border-t-transparent border-r-transparent border-b-accent border-l-accent animate-spin opacity-50 ${sizeClasses[size].split(' ')[2]}`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
    </div>
  );
}
