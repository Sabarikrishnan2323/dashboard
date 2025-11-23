import React from 'react';

const FilterPanel = ({ filters, filterOptions, onFilterChange }) => {
  const handleFilterUpdate = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Filters</h2>
      
      <div className="space-y-4">
        {[
          { key: 'country', label: 'Country', options: filterOptions.country || [] },
          { key: 'region', label: 'Region', options: filterOptions.region || [] },
          { key: 'topic', label: 'Topic', options: filterOptions.topics || [] },
          { key: 'sector', label: 'Sector', options: filterOptions.sector || [] },
          { key: 'pestle', label: 'PEST', options: filterOptions.pestle || [] },
          { key: 'swot', label: 'SWOT', options: filterOptions.swot || [] },
          { key: 'source', label: 'Source', options: filterOptions.source || [] }
        ].map(({ key, label, options }) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <select 
              value={filters[key] || ''}
              onChange={(e) => handleFilterUpdate(key, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">All {label}</option>
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        ))}

        <div className="pt-4 border-t">
          <h3 className="font-medium mb-2">Year Range</h3>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="From"
              className="w-full p-2 border border-gray-300 rounded"
              value={filters.year_min || ''}
              onChange={(e) => handleFilterUpdate('year_min', e.target.value)}
            />
            <input
              type="number"
              placeholder="To"
              className="w-full p-2 border border-gray-300 rounded"
              value={filters.year_max || ''}
              onChange={(e) => handleFilterUpdate('year_max', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;