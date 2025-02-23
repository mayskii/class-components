import { useState, useEffect } from 'react';

const useStorageSearch = (key: string, defaultValue: string) => {
  const [searchTerm, setSearchTerm] = useState<string>(() => {
    const savedSearchTerm = localStorage.getItem(key);
    return savedSearchTerm ? savedSearchTerm : defaultValue;
  });

  useEffect(() => {
    if (searchTerm) {
      localStorage.setItem(key, searchTerm);
    }
  }, [searchTerm, key]);

  return [searchTerm, setSearchTerm] as const;
};

export default useStorageSearch;
