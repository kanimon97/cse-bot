import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Bell, BarChart2 } from 'lucide-react';
import { StockData } from '../types';

interface StockCardProps {
  data: StockData;
}

const StockCard: React.FC<StockCardProps> = ({ data }) => {
  const isPositive = data.change >= 0;
  const ColorIcon = isPositive ? TrendingUp : TrendingDown;
  const ArrowIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="mt-4 mb-2 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-gray-200 shadow-sm overflow-hidden max-w-sm sm:max-w-md w-full hover:shadow-md transition-shadow duration-300">
      {/* Accent Bar */}
      <div className={`h-1 w-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} />
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight">{data.name}</h3>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md mt-1 inline-block">
              {data.symbol}
            </span>
          </div>
          <div className={`p-2 rounded-full ${isPositive ? 'bg-green-50' : 'bg-red-50'}`}>
            <ColorIcon className={`w-5 h-5 ${isPositive ? 'text-green-600' : 'text-red-500'}`} />
          </div>
        </div>

        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-4xl font-bold text-gray-900 tracking-tight">
            {data.currency} {data.price.toFixed(2)}
          </span>
          <div className={`flex items-center font-semibold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
            <ArrowIcon className="w-4 h-4 mr-0.5" />
            <span>{Math.abs(data.change).toFixed(2)}</span>
            <span className="ml-1">({Math.abs(data.changePercent).toFixed(2)}%)</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white border border-gray-100 p-2 rounded-lg text-center shadow-sm">
            <span className="text-xs text-gray-500 uppercase font-medium">Open</span>
            <div className="font-semibold text-gray-900 mt-0.5">{data.open.toFixed(2)}</div>
          </div>
          <div className="bg-white border border-gray-100 p-2 rounded-lg text-center shadow-sm">
            <span className="text-xs text-gray-500 uppercase font-medium">High</span>
            <div className="font-semibold text-gray-900 mt-0.5">{data.high.toFixed(2)}</div>
          </div>
          <div className="bg-white border border-gray-100 p-2 rounded-lg text-center shadow-sm">
            <span className="text-xs text-gray-500 uppercase font-medium">Low</span>
            <div className="font-semibold text-gray-900 mt-0.5">{data.low.toFixed(2)}</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-400">Updated {data.lastUpdated}</span>
          
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              <Bell className="w-3.5 h-3.5" />
              Alert
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
              <BarChart2 className="w-3.5 h-3.5" />
              Chart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCard;