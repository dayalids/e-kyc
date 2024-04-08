import React from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import useDarkMode from "@/hooks/useDarkMode";

const Partnerprogress = ({
  className = 'bg-white dark:bg-slate-800 rounded py-3 px-4 md:col-span-2',
  percentCompleted,
}) => {
  const [isDark] = useDarkMode();

  const series = [percentCompleted, 100 - percentCompleted];

  const options = {
    labels: ['Completed', 'Pending'],
    dataLabels: {
      enabled: false,
    },
    colors: ['#0CE7FA', '#FA916B'],
    legend: {
      position: 'bottom',
      fontSize: '14px',
      fontFamily: 'Inter',
      fontWeight: 400,
      markers: {
        width: 8,
        height: 8,
        offsetY: 0,
        offsetX: -5,
        radius: 12,
      },
      itemMargin: {
        horizontal: 18,
        vertical: 0,
      },
      labels: {
        colors: isDark ? '#CBD5E1' : '#475569',
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
        },
      },
    },

    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };
  return (
    <div className={` ${className} `}>
      <div className="flex-none bg-white dark:bg-slate-800 items-center">
        <div className="flex-1">
          <div className="flex w-full justify-center items-center">
            <span className="text-blue-400">completed {percentCompleted}%</span>
          </div>
          <div className="legend-ring2">
            <Chart
              type="donut"
              height="270"
              options={options}
              series={series}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partnerprogress;
