import React, { useState, useEffect, useRef } from 'react';
import { Search, Calendar, Tag, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Tag {
  category: string;
  value: string;
}

interface OrderFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateRange: { start: Date | null; end: Date | null };
  setDateRange: (range: { start: Date | null; end: Date | null }) => void;
  selectedTags: Tag[];
  setSelectedTags: (tags: Tag[]) => void;
}

const tagCategories = {
  Category: ['Football', 'Flag Football', 'Basketball'],
  Model: ['Flex', 'Hybrid', 'Speed', 'Velocity'],
  Type: ['Jersey', 'Pants', 'Jersey + Pants']
};

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
  selectedTags,
  setSelectedTags,
}) => {
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setShowTagDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTagSelect = (category: string, value: string) => {
    const newTag = { category, value };
    const exists = selectedTags.some(
      tag => tag.category === category && tag.value === value
    );
    
    if (!exists) {
      setSelectedTags([...selectedTags, newTag]);
    }
    setShowTagDropdown(false);
  };

  const removeTag = (tagToRemove: Tag) => {
    setSelectedTags(selectedTags.filter(
      tag => !(tag.category === tagToRemove.category && tag.value === tagToRemove.value)
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="input w-full"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <DatePicker
              selected={dateRange.start}
              onChange={(date) => setDateRange({ ...dateRange, start: date })}
              selectsStart
              startDate={dateRange.start}
              endDate={dateRange.end}
              placeholderText="Start Date"
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <div className="relative">
            <DatePicker
              selected={dateRange.end}
              onChange={(date) => setDateRange({ ...dateRange, end: date })}
              selectsEnd
              startDate={dateRange.start}
              endDate={dateRange.end}
              minDate={dateRange.start}
              placeholderText="End Date"
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setShowTagDropdown(!showTagDropdown)}
            className="btn-secondary"
          >
            <Tag className="w-4 h-4" />
            Add Filter
          </button>
          
          {showTagDropdown && (
            <div
              ref={dropdownRef}
              className="absolute left-0 top-full mt-2 w-72 glass-panel z-10 overflow-hidden"
            >
              {Object.entries(tagCategories).map(([category, values], index) => (
                <div key={category} className="border-b last:border-b-0">
                  <div className="px-4 py-2 bg-gray-50 font-medium text-sm text-gray-700">
                    {category}
                  </div>
                  <div className="p-2 grid grid-cols-2 gap-1">
                    {values.map(value => (
                      <button
                        key={value}
                        onClick={() => handleTagSelect(category, value)}
                        className="text-left px-3 py-2 text-sm rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedTags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm group hover:bg-blue-100 transition-colors"
          >
            <span className="font-medium">{tag.value}</span>
            <button
              onClick={() => removeTag(tag)}
              className="opacity-75 hover:opacity-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};