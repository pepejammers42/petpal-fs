import React, { useState, useEffect, useRef } from 'react';

interface FilterDropdownProps {
  title: string;
  options: string[];
  onFilterChange: (selectedFilters: string[]) => void;
  dropdownId: string; 
  enableSearch?: boolean;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ title, options, onFilterChange, dropdownId, enableSearch = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     // Close dropdown when clicking outside
//     const handleOutsideClick = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleOutsideClick);

//     return () => {
//       document.removeEventListener('mousedown', handleOutsideClick);
//     };
//   }, []);

  useEffect(() => {
    // Filter options based on search term
    if (enableSearch) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const filtered = options.filter((option) => option.toLowerCase().startsWith(lowerCaseSearchTerm));
      setFilteredOptions(filtered);
    } else {
      // If search is disabled, use all options
      setFilteredOptions(options);
    }
  }, [searchTerm, options, enableSearch]);

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
  }, [selectedFilters]);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button className="btn btn-secondary w-4/6 py-2 mt-4 bg-primary-100 text-white rounded-md" onClick={toggleDropdown}>
        {title}
      </button>
      {isOpen && (
        <div className="dropdown-menu w-4/6">
          {enableSearch && (
            <input
              type="text"
              placeholder="Search..."
              className="input-search p-2 mb-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
          {filteredOptions.map((option) => (
            <div key={option} className="flex items-center p-2">
              <input
                type="checkbox"
                id={`${dropdownId}-${option}`} // Use dropdownId to make IDs unique
                checked={selectedFilters.includes(option)}
                onChange={() => handleOptionClick(option)}
                className="mr-2"
              />
              <label htmlFor={`${dropdownId}-${option}`} className={`flex-1 ${selectedFilters.includes(option) ? 'text-blue-500' : ''}`}>
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
