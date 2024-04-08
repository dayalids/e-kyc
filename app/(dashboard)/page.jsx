"use client";
import React from "react";
// import "../../scss/utility/superadmin.scss";
import { superadmincard } from "@/constant/data";
import Card from "@/components/ui/Card";
import RevenueBarChart from "@/components/partials/widget/chart/revenue-bar-chart";
import GroupChart2 from "@/components/partials/widget/chart/group-chart-2";
import EarningChart from "@/components/partials/widget/chart/radials";
const StarterPage = () => {
  return (
    <>
      <div>
        {/* <div className="card2">
          <h5 className="text"> Welcome to Bharat Blockchain Network (BBN)</h5>
          <br />
          <span>
            India's largest Academic Consortium Network. We are happy to partner
            with your College/ University along with 100+ Academic Partners
            across 15 states in India.
          </span>
        </div> */}
        <br />
        <div className="2xl:col-span-9 lg:col-span-8 col-span-12 m-4">
          <div className="grid md:grid-cols-4 grid-cols-1 gap-8">
            <div className="card-chart bg-primary">
              {" "}
              <h5>Welcome to Bharat Blockchain Network (BBN)</h5>
            </div>
            <GroupChart2 />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-5">
          <div className="2xl:col-span-8 lg:col-span-7 col-span-12">
            <Card>
              <div className="legend-ring">
                <RevenueBarChart />
              </div>
            </Card>
          </div>
          <div className="2xl:col-span-4 lg:col-span-5 col-span-12">
            <Card title="Statistic">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                <div className="md:col-span-2">
                  <EarningChart />
                </div>
              </div>
            </Card>
          </div>
        </div>

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
