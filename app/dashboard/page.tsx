"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardPage() {
  // Generate sample data for the chart
  const generateChartData = () => {
    const labels = [];
    const data = [];

    // Generate 30 days of data
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      labels.push(
        date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" })
      );
      data.push(Math.floor(Math.random() * 1000) + 500); // Random values between 500-1500
    }

    return { labels, data };
  };

  const { labels, data } = generateChartData();

  const chartData = {
    labels,
    datasets: [
      {
        label: "Revenue (€)",
        data,
        backgroundColor: "rgba(137, 82, 224, 0.8)",
        borderColor: "rgba(137, 82, 224, 1)",
        borderWidth: 0,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(29, 32, 37, 0.95)",
        titleColor: "rgba(255, 255, 255, 0.92)",
        bodyColor: "rgba(255, 255, 255, 0.92)",
        borderColor: "rgba(255, 255, 255, 0.08)",
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          label: function (context: any) {
            return `€${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.4)",
          font: {
            size: 11,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.04)",
          borderColor: "rgba(255, 255, 255, 0.08)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.4)",
          font: {
            size: 11,
          },
          callback: function (value: any) {
            return `€${value}`;
          },
        },
        border: {
          display: false,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Stats Cards */}
        <div className="bg-[#1d2025] border border-gray-400/50 rounded-md overflow-hidden mb-8">
          <div className="grid grid-cols-4 divide-x divide-white/4">
            {/* Revenue Card */}
            <div className="p-4 border-b-2 border-[#8952e0]">
              <div className="text-[13px] text-white/64 font-medium mb-2">
                Revenue
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-2xl text-white/92 font-semibold">
                  €43.400
                </div>
                <div className="flex items-center gap-1 px-1 bg-[#9fe3cd]/10 rounded-full">
                  <svg
                    className="w-3 h-3 text-[#9fe3cd]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                  <span className="text-[11px] text-[#9fe3cd] font-bold">
                    23%
                  </span>
                </div>
              </div>
              <div className="text-[13px] text-white/64 opacity-80">
                vs. €33.418 last period
              </div>
            </div>

            {/* New Customers Card */}
            <div className="p-4 border-b border-gray-400/50">
              <div className="text-[13px] text-white/64 font-medium mb-2">
                New customers
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-2xl text-white/92 font-semibold">130</div>
                <div className="flex items-center gap-1 px-1 bg-[#9fe3cd]/10 rounded-full">
                  <svg
                    className="w-3 h-3 text-[#9fe3cd]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                  <span className="text-[11px] text-[#9fe3cd] font-bold">
                    29%
                  </span>
                </div>
              </div>
              <div className="text-[13px] text-white/64 opacity-80">
                vs. 92 last period
              </div>
            </div>

            {/* Churned Customers Card */}
            <div className="p-4 border-b border-gray-400/50">
              <div className="text-[13px] text-white/64 font-medium mb-2">
                Churned customers
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-2xl text-white/92 font-semibold">5</div>
                <div className="flex items-center gap-1 px-1 bg-[#f1b8b4]/10 rounded-full">
                  <svg
                    className="w-3 h-3 text-[#f1b8b4]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  <span className="text-[11px] text-[#f1b8b4] font-bold">
                    2%
                  </span>
                </div>
              </div>
              <div className="text-[13px] text-white/64 opacity-80">
                vs. 3 last period
              </div>
            </div>

            {/* Active Users Card */}
            <div className="p-4 border-b border-gray-400/50">
              <div className="text-[13px] text-white/64 font-medium mb-2">
                Active users
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-2xl text-white/92 font-semibold">1337</div>
                <div className="flex items-center gap-1 px-1 bg-[#9fe3cd]/10 rounded-full">
                  <svg
                    className="w-3 h-3 text-[#9fe3cd]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                  <span className="text-[11px] text-[#9fe3cd] font-bold">
                    10%
                  </span>
                </div>
              </div>
              <div className="text-[13px] text-white/64 opacity-80">
                vs. 1199 last period
              </div>
            </div>
          </div>

          {/* Chart.js Implementation */}
          <div className="p-8">
            <div className="h-[300px]">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Bottom Section - Tables */}
        <div className="grid grid-cols-2 gap-8">
          {/* Top Countries Table */}
          <div className="bg-[#1d2025] border border-gray-400/50 rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-400/50">
              <h3 className="text-[14px] text-white/92 font-medium">
                Top countries
              </h3>
            </div>
            <div className="overflow-auto">
              <table className="w-full text-[13px]">
                <thead className="bg-[#171a1d]">
                  <tr className="border-b border-gray-400/50">
                    <th className="px-4 py-3 text-left text-[12px] text-[#abadaf] font-medium">
                      Country
                    </th>
                    <th className="px-4 py-3 text-right text-[12px] text-[#abadaf] font-medium">
                      Sales
                    </th>
                    <th className="px-4 py-3 text-right text-[12px] text-[#abadaf] font-medium">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#171a1d]">
                  {[
                    {
                      country: "US",
                      sales: 446,
                      total: "€32.684",
                      progress: 75,
                    },
                    {
                      country: "India",
                      sales: 294,
                      total: "€29.725",
                      progress: 68,
                    },
                    {
                      country: "Brazil",
                      sales: 253,
                      total: "€14.916",
                      progress: 34,
                    },
                    {
                      country: "Netherlands",
                      sales: 14,
                      total: "€253",
                      progress: 1,
                    },
                    {
                      country: "Germany",
                      sales: 154,
                      total: "€19.179",
                      progress: 44,
                    },
                    {
                      country: "France",
                      sales: 27,
                      total: "€1.065",
                      progress: 2,
                    },
                    {
                      country: "United Kingdom",
                      sales: 24,
                      total: "€9.058",
                      progress: 21,
                    },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-400/50 hover:bg-white/2"
                    >
                      <td className="px-4 py-3 text-white/92">{row.country}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1 bg-white/16 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#8952e0] rounded-full"
                              style={{ width: `${row.progress}%` }}
                            />
                          </div>
                          <span className="text-white/92 w-12 text-right">
                            {row.sales}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-white/92">
                        {row.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-[#1d2025] border border-gray-400/50 rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-400/50">
              <h3 className="text-[14px] text-white/92 font-medium">
                Activity
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {[
                {
                  name: "Helmut Magomedov",
                  action: "signed up",
                  time: "Just now",
                },
                {
                  name: "Dariusz Thomas",
                  action: "signed up",
                  time: "Yesterday",
                },
                {
                  name: "Christian Amadi",
                  action: "upgraded to Pro",
                  time: "Yesterday",
                },
                {
                  name: "Kanchana Nowak",
                  action: "signed up",
                  time: "Yesterday",
                },
                {
                  name: "Aisha Njuguna",
                  action: "cancelled subscription",
                  time: "2 days ago",
                },
                {
                  name: "Tomiko Njeri",
                  action: "signed up",
                  time: "2 days ago",
                },
                {
                  name: "John Doe",
                  action: "upgraded to Pro",
                  time: "3 days ago",
                },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
                    {i < 6 && (
                      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-px h-3 bg-white/8" />
                    )}
                  </div>
                  <div className="text-[13px]">
                    <span className="text-white/92 font-medium">
                      {activity.name}
                    </span>
                    <span className="text-white/64">
                      {" "}
                      {activity.action} · {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
