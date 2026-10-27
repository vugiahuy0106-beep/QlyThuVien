import React from 'react';
import { MonthlyLoanStat } from '../../reports/types';
import { TrendingUp, Calendar } from 'lucide-react';

interface MonthlyLoansChartProps {
  data: MonthlyLoanStat[];
}

export const MonthlyLoansChart: React.FC<MonthlyLoansChartProps> = ({ data }) => {
  const maxCount = Math.max(...data.map((d) => d.count), 5);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Thống kê Lượt Mượn Sách Theo Tháng</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Dữ liệu tổng hợp thực tế từ các phiếu mượn trong 6 tháng gần nhất
          </p>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="pt-2">
        <div className="h-56 flex items-end gap-3 sm:gap-6 px-2">
          {data.map((item, idx) => {
            const heightPercent = Math.max(8, Math.round((item.count / maxCount) * 100));

            return (
              <div key={item.monthKey} className="flex-1 flex flex-col items-center h-full justify-end group">
                {/* Count badge on hover or always */}
                <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mb-1.5 transition-all group-hover:scale-110">
                  {item.count}
                </div>

                {/* Bar */}
                <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800 rounded-t-xl overflow-hidden flex items-end h-40">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-xl transition-all duration-500 group-hover:brightness-110 shadow-xs"
                  />
                </div>

                {/* Month label */}
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-2 truncate max-w-full text-center">
                  {item.monthKey.slice(5)}/{item.monthKey.slice(2, 4)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-gradient-to-tr from-indigo-600 to-violet-500" />
            <span>Số lượt phiếu mượn phát hành</span>
          </div>
        </div>
      </div>
    </div>
  );
};
