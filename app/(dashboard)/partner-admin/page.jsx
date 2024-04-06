'use client';
import React from 'react';
import '../../scss/utility/partnerdasboard.scss';
import Card from '@/components/ui/Card';
import Partnerprogress from "@/components/features/partnerprogress"
import useDarkMode from "@/hooks/useDarkMode";
import SkeletionTable from '@/components/skeleton/Table';
import { GET_STATUS_BY_USER } from '../../../configs/graphql/queries';
import { useQuery } from 'graphql-hooks';

const PartnerDashboard = ({ alerts }) => {
  const [isDark] = useDarkMode();
  const { data, error, loading } = useQuery(GET_STATUS_BY_USER);

  if (loading) return <SkeletionTable />;
  if (error) return <pre>{error.message}</pre>;
  const currentStatus = data?.getEntityByUser.status;
  const completedPercent = (currentStatus / 5) * 100;

  return (
    <>
      {/* <div className="card card-bg card-custom ">
        <div className="style-head mb-5 ml-10">
          Welcome to Bharat Blockchain Network (BBN)
        </div>
        <p className='mx-4'>
          Welcome to Bharat Blockchain Network initiative to create a consortium
          network among academic partners across India. Such collaborations can
          lead to better sharing of resources, knowledge, and expertise, which
          can ultimately benefit the students and academic community.
        </p>

        
</div> */}
      {[alerts].map((alert, index) => (
        <div key={index} className="alert">
          {alert?.message}
        </div>
      ))}
      <Card className="  bg-white ">
        <div className="progress-div">
          <div
            className={` ${isDark ? 'dark-progress-item' : 'progress-item'}  ${
              currentStatus >= 1 ? 'progress-completed' : 'progress-pending'
            }`}
          >
            <div className="progress-item-left">
              <img
                src="/assets/images/vector.svg"
                alt="vector"
                className="svg-icon svg-icon-xl svg-icon-success"
              />
            </div>
            <div className="progress-item-right">
              <h2>Account Details</h2>
              <p>{currentStatus >= 1 ? 'Completed' : 'Pending'}</p>
            </div>
          </div>

          <div
            className={` ${isDark ? 'dark-progress-item' : 'progress-item'}   ${
              currentStatus >= 2 ? 'progress-completed' : 'progress-pending'
            }`}
          >
            <div className="progress-item-left">
              <img
                src="/assets/images/Vector1.svg"
                alt="vector"
                className="svg-icon svg-icon-xl svg-icon-success"
              />
            </div>
            <div className="progress-item-right">
              <h2>KYB Details</h2>
              <p>{currentStatus >= 2 ? 'Completed' : 'Pending'}</p>
            </div>
          </div>

          <div
            className={` ${isDark ? 'dark-progress-item' : 'progress-item'}   ${
              currentStatus >= 3 ? 'progress-completed' : 'progress-pending'
            }`}
          >
            <div className="progress-item-left">
              <img
                src="/assets/images/Vector1.svg"
                alt="vector"
                className="svg-icon svg-icon-xl svg-icon-success"
              />
            </div>
            <div className="progress-item-right">
              <h2>Signing the MoU</h2>
              <p>{currentStatus >= 3 ? 'Completed' : 'Pending'}</p>
            </div>
          </div>

          <div
            className={` ${isDark ? 'dark-progress-item' : 'progress-item'}  ${
              currentStatus >= 4 ? 'progress-completed' : 'progress-pending'
            }`}
          >
            <div className="progress-item-left">
              <img
                src="/assets/images/Nomination.svg"
                alt="vector"
                className="svg-icon svg-icon-xl svg-icon-success"
              />
            </div>
            <div className="progress-item-right">
              <h2>Nomination</h2>
              <p>{currentStatus >= 4 ? 'Completed' : 'Pending'}</p>
            </div>
          </div>
          <div
            className={` ${isDark ? 'dark-progress-item' : 'progress-item'}   ${
              currentStatus >= 5 ? 'progress-completed' : 'progress-pending'
            }`}
          >
            <div className="progress-item-left">
              <img
                src="/assets/images/Node-setup.svg"
                alt="vector"
                className="svg-icon svg-icon-xl svg-icon-success"
              />
            </div>
            <div className="progress-item-right">
              <h2>Node Setup</h2>
              <p>{currentStatus >= 5 ? 'Completed' : 'Pending'}</p>
            </div>
          </div>
        </div>
      </Card>
      <div className="mb-24">
        <div className="dashboard-profile  ">
          <div className="dashboard-first">
            <div className="dashboard-first-first  dark:bg-black-800">
              <div className="dashboard-ff-top">
                <h2>Node Details</h2>
              </div>
              <div className="dashboard-ff-main">
                <div className="info-group">
                  <p>Status</p>
                  <h2 style={{ color: 'red' }}>Inactive</h2>
                </div>
                <div className="info-group">
                  <p className="text-slate-800 dark:text-slate-400">
                    Public key
                  </p>
                  <h2>a2sfus687ja</h2>
                </div>
                <div className="info-group">
                  <p className="text-slate-800 dark:text-slate-400">
                    Enode Address
                  </p>
                  <h2>12365874</h2>
                </div>
              </div>
            </div>

            <div class="dashboard-first-first  dark:bg-black-800">
              <div class="dashboard-ff-top">
                <h2>Signatory Authority Details</h2>
              </div>
              <div class="dashboard-ff-main">
                <div class="info-group">
                  <p className="text-slate-800 dark:text-slate-400">Name</p>
                  <h2>signatory Authority</h2>
                </div>
                <div class="info-group">
                  <p className="text-slate-800 dark:text-slate-400">
                    Designation
                  </p>
                  <h2>Signatory Designation</h2>
                </div>
                <div class="info-group">
                  <p className="text-slate-800 dark:text-slate-400">Email</p>
                  <h2>signatory@gmail.com</h2>
                </div>
              </div>
            </div>

            <div class="dashboard-first-first  dark:bg-black-800">
              <div class="dashboard-ff-top">
                <h2>Track your progress</h2>
              </div>
              <div class="dashboard-ff-main dark:bg-slate-800 ">
                <Partnerprogress percentCompleted={completedPercent} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnerDashboard;
