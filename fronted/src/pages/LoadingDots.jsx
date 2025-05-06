import { useState, useEffect } from 'react';

const LoadingDots = ({ color = 'blue', size = 'default' }) => {
  const [dots, setDots] = useState(1);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev % 4) + 1);
    }, 300);
    
    return () => clearInterval(interval);
  }, []);
  
  const dotSizeClass = size === 'large' ? 'h-3 w-3' : 'h-2 w-2';
  const dotColorClass = 
    color === 'white' ? 'bg-white' : 
    color === 'blue' ? 'bg-blue-600' :
    'bg-gray-600';
  
  const renderDots = () => {
    return Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className={`${dotSizeClass} rounded-full mx-1 ${i < dots ? dotColorClass : 'bg-opacity-30 ' + dotColorClass}`}
        style={{
          transform: i < dots ? 'scale(1)' : 'scale(0.7)',
          transition: 'all 0.15s ease-in-out'
        }}
      ></div>
    ));
  };
  
  return (
    <div className="flex items-center justify-center">
      {renderDots()}
    </div>
  );
};

export default LoadingDots;