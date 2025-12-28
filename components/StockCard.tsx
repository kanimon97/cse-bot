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
    <div className="mt-4 mb-2 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full max-w-[calc(100vw-2rem)] sm:max-w-sm hover:shadow-md transition-shadow duration-300">
      {/* Accent Bar */}
      <div className={`h-1 w-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} />
      
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="min-w-0 flex-1 pr-2">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight break-words">{data.name}</h3>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md mt-1 inline-block">
              {data.symbol}
            </span>
          </div>
          <div className={`p-2 rounded-full flex-shrink-0 ${isPositive ? 'bg-green-50' : 'bg-red-50'}`}>
            <ColorIcon className={`w-5 h-5 ${isPositive ? 'text-green-600' : 'text-red-500'}`} />
          </div>
        </div>

        <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-6">
          <span className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            {data.currency} {data.price.toFixed(2)}
          </span>
          <div className={`flex items-center font-semibold text-sm sm:text-base ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
            <ArrowIcon className="w-4 h-4 mr-0.5 flex-shrink-0" />
            <span>{Math.abs(data.change).toFixed(2)}</span>
            <span className="ml-1">({Math.abs(data.changePercent).toFixed(2)}%)</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white border border-gray-100 p-2 rounded-lg text-center shadow-sm min-w-0">
            <span className="text-xs text-gray-500 uppercase font-medium block truncate">Open</span>
            <div className="font-semibold text-gray-900 mt-0.5 text-sm sm:text-base truncate">{data.open.toFixed(2)}</div>
          </div>
          <div className="bg-white border border-gray-100 p-2 rounded-lg text-center shadow-sm min-w-0">
            <span className="text-xs text-gray-500 uppercase font-medium block truncate">High</span>
            <div className="font-semibold text-gray-900 mt-0.5 text-sm sm:text-base truncate">{data.high.toFixed(2)}</div>
          </div>
          <div className="bg-white border border-gray-100 p-2 rounded-lg text-center shadow-sm min-w-0">
            <span className="text-xs text-gray-500 uppercase font-medium block truncate">Low</span>
            <div className="font-semibold text-gray-900 mt-0.5 text-sm sm:text-base truncate">{data.low.toFixed(2)}</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-400 truncate max-w-full">Updated {data.lastUpdated}</span>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors min-h-[44px] flex-1 sm:flex-initial">
              <Bell className="w-3.5 h-3.5" />
              <span>Alert</span>
            </button>
            <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors min-h-[44px] flex-1 sm:flex-initial">
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Chart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCard;