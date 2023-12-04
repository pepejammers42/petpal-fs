import React, { useState, useEffect, useRef } from 'react';

interface FilterDropdownProps {
  title: string;
  options: string[];
  onFilterChange: (selectedFilters: string[]) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ title, options, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    // Filter options based on search term
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = options.filter((option) => option.toLowerCase().startsWith(lowerCaseSearchTerm));
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (option: string) => {
    setSelectedFilters((prevFilters) => {
      if (prevFilters.includes(option)) {
        return prevFilters.filter((filter) => filter !== option);
      } else {
        return [...prevFilters, option];
      }
    });
  };

  useEffect(() => {
    // Notify parent component of filter changes
    onFilterChange(selectedFilters);
  }, [selectedFilters, onFilterChange]);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button className="btn btn-secondary w-full" onClick={toggleDropdown}>
        {title}
      </button>
      {isOpen && (
        <div className="dropdown-menu w-full">
          <input
            type="text"
            placeholder="Search..."
            className="input-search p-2 mb-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {filteredOptions.map((option) => (
            <div key={option} className="flex items-center p-2">
              <input
                type="checkbox"
                id={option}
                checked={selectedFilters.includes(option)}
                onChange={() => handleOptionClick(option)}
                className="mr-2"
              />
              <label htmlFor={option} className={`flex-1 ${selectedFilters.includes(option) ? 'text-blue-500' : ''}`}>
                {option}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
