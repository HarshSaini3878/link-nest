import { createContext, useState, useContext } from 'react';

const BackgroundContext = createContext();

export const BackgroundProvider = ({ children }) => {
  const [currentGradient, setCurrentGradient] = useState(Math.floor(Math.random() * 3));

  const changeGradient = () => {
    setCurrentGradient((prev) => (prev + 1) % gradients.length);
  };

  const gradients = [
    'from-purple-600 via-pink-500 to-red-500',
    'from-blue-500 via-teal-400 to-green-500',
    'from-yellow-400 via-orange-500 to-red-600',
    'from-indigo-600 via-purple-500 to-pink-500',
  ];

  return (
    <BackgroundContext.Provider value={{ currentGradient, changeGradient, gradients }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => {
  return useContext(BackgroundContext);
};
