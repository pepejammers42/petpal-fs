import React, { useState, useEffect, createContext, useContext } from 'react';
import { IoMdArrowDropdown } from "react-icons/io";

const DropdownContext = createContext({
  currentZIndex: 0,
  setCurrentZIndex: (zIndex: number) => {},
});

const useDropdownZIndex = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdownZIndex must be used within a DropdownProvider');
  }
  return context;
};

type DropdownProviderProps = {
    children: React.ReactNode;
};

const DropdownProvider: React.FC<DropdownProviderProps> = ({ children }) => {
    const [currentZIndex, setCurrentZIndex] = useState(0);

    return (
        <DropdownContext.Provider value={{ currentZIndex, setCurrentZIndex }}>
            {children}
        </DropdownContext.Provider>
    );
};

type DropdownProps = {
  data: string[];
  className?: string;
  category: string;
  enableSearch?: boolean;
  value: string;
  onChange: (value: string) => void;
};

const DropDown: React.FC<DropdownProps> = ({
  data,
  category,
  className = "",
  enableSearch = false,
  value,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data || []);
  const { currentZIndex, setCurrentZIndex } = useDropdownZIndex();
  const [zIndex, setZIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const newZIndex = currentZIndex + 1;
      setZIndex(newZIndex);
      setCurrentZIndex(newZIndex);
    }
  }, [isOpen, currentZIndex, setCurrentZIndex]);
  

  useEffect(() => {
    if (enableSearch && data) {
      setFilteredData(
        data.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data, enableSearch]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className={`relative ${className}`} style={{ zIndex: isOpen ? zIndex : 1 }}>
        <button
            className="inline-flex items-center justify-center w-4/5 px-3 py-2 text-fg-secondary  font-medium bg-primary-100 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
            onClick={toggleDropdown}
            >
            <div className="flex flex-col items-center mx-auto">
                <span className="text-center text-lg ">{category.toUpperCase()}</span>
                <span className="text-center text-sm text-fg-accent">{value}</span>
            </div>
            <span className='text-2xl ml-2'><IoMdArrowDropdown /></span>
        </button>

    <div
        className={`${isOpen ? 'block' : 'hidden'} absolute mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1`}
        style={{ width: 'calc(105%)' }}
    >
        {enableSearch && (
          <input
            className="block px-4 py-2 w-full text-gray-800 border rounded-md border-gray-300 focus:outline-none"
         
            type="text"
            placeholder={`Search ${category?.toLowerCase()}`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        )}
        {filteredData.map((item, index) => (
          <a
            key={index}
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md"
            onClick={() => handleItemClick(item)}
          >
            {item}
          </a>
        ))}
      </div>
    </div>
  );
};

export { DropdownProvider, DropDown };
