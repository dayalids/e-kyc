'use client';
import React, { useCallback, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import EditForm from './Edit';
import GlobalFilter from '../../../../../components/partials/table/GlobalFilter';
import Card from './Card';

const DappCard = ({ items, openForm, featureList }) => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editIdx, setEditIdx] = useState();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const observer = useRef();
  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  const openUserModal = (idx) => {
    setEditIdx(idx);
    setIsUserModalOpen(true);
  };

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row justify-between items-center p-4">
        <div>
          <h4 className="card-title mb-2">Dapp list</h4>
        </div>
        <div className="flex flex-col sm:flex-row justify-center  items-center gap-6">
          <div className="mt-5">
            {/* <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} /> */}
          </div>
          <Button
            text={'Create New Dapp'}
            icon={'heroicons-outline:plus'}
            onClick={() => {
              openForm();
            }}
            className={'w-fit h-10 btn btn-dark text-white items-center '}
          />
        </div>
      </div>
      <div>
        <EditForm
          isUserModalOpen={isUserModalOpen}
          setIsUserModalOpen={setIsUserModalOpen}
          data={items[editIdx] || {}}
          featureList={featureList}
        />
        <div className="flex flex-col sm:grid gap-10 xl:grid-cols-3 md:grid-cols-2 justify-center">
          {items.map((item, idx) => {
            if (idx === items.length - 1) {
              return (
                <div ref={lastItemRef} key={item.id}>
                  <Card
                    item={item}
                    LogoKey={item.logo}
                    idx={idx}
                    key={item.id}
                    openUserModal={openUserModal}
                  />
                </div>
              );
            } else {
              return (
                <Card
                  item={item}
                  LogoKey={item.logo}
                  idx={idx}
                  key={item.id}
                  openUserModal={openUserModal}
                />
              );
            }
          })}
        </div>
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default DappCard;
