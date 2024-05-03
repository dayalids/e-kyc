'use client';
import React from 'react';
// import "../../scss/utility/superadmin.scss";
import { superadmincard } from '@/constant/data';
import Card from '@/components/ui/Card';
import RevenueBarChart from '@/components/partials/widget/chart/revenue-bar-chart';
import GroupChart2 from '@/components/partials/widget/chart/group-chart-2';
import EarningChart from '@/components/partials/widget/chart/radials';
const StarterPage = () => {
	return (
		<>
			<div>
				<div className="card2">
          <h5 className="text"> Welcome to E-KYC Application</h5>
          <br />
          <span>
		  A Blockchain based DAPP.
          </span>
        </div>
				<br />
				{/* <div className='col-span-12 lg:col-span-8 2xl:col-span-9 m-4'>
					<div className='gap-8 grid grid-cols-1 md:grid-cols-4 w-full'>
						<div className='bg-primary card-chart'>
							{' '}
							<h4>Welcome to E-KYC application </h4>
							<h5>Blockchain based DAPP.</h5>
						</div>

					
					</div>
				</div> */}

				<div className='gap-5 grid grid-cols-1 md:grid-cols-2'>
				<GroupChart2 />
				</div>
				{/* <div className="gap-5 grid grid-cols-12">
          <div className="col-span-12 lg:col-span-7 2xl:col-span-8">
            <Card>
              <div className="legend-ring">
                <RevenueBarChart />
              </div>
            </Card>
          </div>
          <div className="col-span-12 lg:col-span-5 2xl:col-span-4">
            <Card title="Statistic">
              <div className="gap-5 grid grid-cols-1 md:grid-cols-2">
                <div className="md:col-span-2">
                  <EarningChart />
                </div>
              </div>
            </Card>
          </div>
        </div> */}

				{/* <div className="grid">
               
          <div className="frame">
             {superadmincard.map((item, i) => (
              <li key={i} className="block py-[10px]">
                <div className="grid-item">
                  <img className="center" src={item.img} alt={item.img} />
                  <p>{item.title}</p>
                  <p>{item.count}</p>
                </div>
              </li>
            ))}          

          </div>
            </div> */}
			</div>
		</>
	);
};

export default StarterPage;
