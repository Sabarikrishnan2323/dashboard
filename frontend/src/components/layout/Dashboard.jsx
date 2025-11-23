























        













































        






















 






    











































import React, { useState, useEffect } from 'react';
import API from '../../api';
import Heatmap from '../charts/Heatmap';
import LineChart from '../charts/LineChart';
import BarChart from '../charts/BarChart';
import PieChart from '../charts/PieChart';
import ScatterPlot from '../charts/ScatterPlot';
import LoadingSpinner from '../common/LoadingSpinner';
import WorldMap from '../charts/WorldMap';

const Dashboard = ({ filters }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });

        const response = await API.get(`/stats/?${params}`);
        setStats(response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [filters]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Data Visualization Dashboard</h1>
        <p className="text-gray-600">Interactive analytics and insights</p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-lg border border-gray-200 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-600 mb-1">1,847</div>
          <div className="text-gray-600 text-sm">Total Data</div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200 text-center shadow-sm">
          <div className="text-2xl font-bold text-green-600 mb-1">7.2</div>
          <div className="text-gray-600 text-sm">Avg Intensity</div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200 text-center shadow-sm">
          <div className="text-2xl font-bold text-purple-600 mb-1">42</div>
          <div className="text-gray-600 text-sm">Countries</div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200 text-center shadow-sm">
          <div className="text-2xl font-bold text-orange-600 mb-1">156</div>
          <div className="text-gray-600 text-sm">Topics</div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

       
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Top Countries</h3>
            <div className="h-80">
              <BarChart data={stats?.country_stats} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Yearly Trends</h3>
            <div className="h-64">
              <LineChart data={stats?.year_stats} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">Topic vs Region Heatmap</h3>
    <div className="h-72">
      <Heatmap data={stats?.heatmap_stats} width={450} height={300} />
    </div>
  </div>

        

</div>


        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Topics Distribution</h3>
            <div className="h-80">
              <PieChart data={stats?.topics_stats} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Regional Distribution</h3>
            <div className="h-64">
              <BarChart data={stats?.region_stats} horizontal={true} />
            </div>
          </div>

          

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Intensity vs Likelihood</h3>
            <div className="h-64">
              <ScatterPlot data={stats?.scatter} />
            </div>
          </div>
        </div>
      </div>

      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mt-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Geographical Distribution</h3>
        <div className="w-full h-[550px]">
          <WorldMap data={stats?.country_stats} height={550} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
