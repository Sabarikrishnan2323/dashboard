import React from 'react';

const FilterItem = ({ label, options, value, onChange, multiple = false }) => {
  const handleChange = (event) => {
    if (multiple) {
      const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
      onChange(selectedOptions.join(','));
    } else {
      onChange(event.target.value);
    }
  };

  return (
    <div className="space-y-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {multiple ? (
        <select
          multiple
          value={value ? value.split(',') : []}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
          size={Math.min(options.length, 6)}
        >
          {options.map(option => (
            <option key={option} value={option} className="py-2">
              {option}
            </option>
          ))}
        </select>
      ) : (
        <select
          value={value || ''}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white appearance-none cursor-pointer"
        >
          <option value="" className="text-gray-400">All {label}</option>
          {options.map(option => (
            <option key={option} value={option} className="py-2">
              {option}
            </option>
          ))}
        </select>
      )}
      {multiple && value && (
        <div className="flex flex-wrap gap-2 mt-3">
          {value.split(',').map(val => (
            <span
              key={val}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
            >
              {val}
              <button
                type="button"
                onClick={() => {
                  const newValues = value.split(',').filter(v => v !== val).join(',');
                  onChange(newValues || null);
                }}
                className="ml-2 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center transition-colors duration-200"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterItem;