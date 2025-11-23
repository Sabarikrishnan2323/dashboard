import React, { useState, useEffect } from 'react';
import Dashboard from './components/layout/Dashboard';
import FilterPanel from './components/filters/FilterPanel';
import API from './api';

function App() {
  const [filters, setFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState({});

  useEffect(() => {
    API.get('/filters/')
      .then(response => setFilterOptions(response.data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Filter Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <FilterPanel 
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={setFilters}
        />
      </div>
      
      {/* Main Dashboard */}
      <div className="flex-1 overflow-auto">
        <Dashboard filters={filters} />
      </div>
    </div>
  );
}

export default App;

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       {/* Test 1: Basic Tailwind */}
//       <h1 className="text-4xl font-bold text-blue-600 text-center mb-8">
//         Tailwind CSS Test
//       </h1>
      
//       {/* Test 2: Colors and layout */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//         <div className="bg-red-500 text-white p-6 rounded-lg text-center shadow-lg">
//           <div className="text-2xl font-bold">Red</div>
//           <div className="text-sm">If colored, Tailwind works!</div>
//         </div>
//         <div className="bg-green-500 text-white p-6 rounded-lg text-center shadow-lg">
//           <div className="text-2xl font-bold">Green</div>
//           <div className="text-sm">If colored, Tailwind works!</div>
//         </div>
//         <div className="bg-blue-500 text-white p-6 rounded-lg text-center shadow-lg">
//           <div className="text-2xl font-bold">Blue</div>
//           <div className="text-sm">If colored, Tailwind works!</div>
//         </div>
//       </div>
      
//       {/* Test 3: If Tailwind fails */}
//       <div style={{backgroundColor: 'orange', padding: '20px', textAlign: 'center', border: '2px solid black'}}>
//         <h2 style={{color: 'black', margin: 0}}>
//           If you see this ORANGE box with BLACK border, Tailwind is NOT working
//         </h2>
//       </div>
//     </div>
//   );
// }

// export default App;