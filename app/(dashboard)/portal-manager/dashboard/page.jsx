'use client';
import React, { useState } from 'react';
import '../../../scss/utility/_superadmin.scss';
import Card from '@/components/ui/Card';
import TrackingParcel from '@/components/partials/widget/activity';
import { meets } from '@/constant/data';
import Icon from '@/components/ui/Icon';
import RevenueBarChart from '@/components/partials/widget/chart/revenue-bar-chart';
import GroupChart3 from '@/components/partials/widget/chart/group-chart-3';
import { useQuery } from 'graphql-hooks';
import ImageViewerModal from '@/components/features/IMAGEviewer/ImageViewerModal';

const ManagerDashboard = () => {
  return (
    <div>
      <br />
      <div></div>
      <div className="grid grid-cols-12 gap-5">
        <div className="2xl:col-span-8 lg:col-span-7 col-span-12">
          {/* <div className="card-chart  mb-6 text-center">
              <h5>Welcome to Bharat Blockchain Network (BBN)</h5>
              <p>Lorem  ipsum dolor sit amet consectetur ipsum dolor sit amet consectetur adipisicing elit.
                debit!</p>
            </div> */}

          <div className="legend-ring mt-2 ">
            <div className="grid md:grid-cols-4 grid-cols-1 gap-8">
              <GroupChart3 />
            </div>
          </div>

          <Card className="mt-6 bg-white">
            {' '}
            <div className="legend-ring  ">
              <RevenueBarChart />
            </div>
          </Card>
        </div>
        <div className="2xl:col-span-4 lg:col-span-5 col-span-12">
          <Card title="Notes" className="xl:col-span-4 col-span-12 bg-white">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
              <div className="md:col-span-2">
                <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                  {meets.slice(0, 3).map((item, i) => (
                    <li key={i} className="block py-[10px]">
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <div className="flex-1 flex space-x-2 rtl:space-x-reverse">
                          <div className="flex-none">
                            <div className="h-8 w-8">
                              <img
                                src={item.img}
                                alt=""
                                className="block w-full h-full object-cover rounded-full border hover:border-white border-transparent"
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <span className="block text-slate-600 text-sm dark:text-slate-300 mb-1 font-medium">
                              {item.title}
                            </span>
                            <span className="flex font-normal text-xs dark:text-slate-400 text-slate-500">
                              <span className="text-base inline-block mr-1">
                                <Icon icon="heroicons-outline:video-camera" />
                              </span>
                              {item.meet}
                            </span>
                          </div>
                        </div>
                        <div className="flex-none">
                          <span className="block text-xs text-slate-600 dark:text-slate-400">
                            {item.date}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
          <Card title="Statistic" className="mt-4 bg-white">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
              <div className="md:col-span-2">
                <TrackingParcel />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default ManagerDashboard;
