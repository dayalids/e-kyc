import React, { useState } from 'react';
import Button from '../../../../../components/ui/Button';
import Tooltip from '../../../../../components/ui/Tooltip';
import { Icon } from '@iconify/react';
import { useQuery } from 'graphql-hooks';
import { GET_OBJECT_QUERY } from '../../../../../configs/graphql/queries';

const Card = ({
  item,
  idx,
  LogoKey,
  openUserModal,
  // LogoHeading,
  // Description,
  // Type,
  // CreatedBy,
  // LastUpdated,
  // Status,
  // Id
}) => {
  let LogoSrc = null;

  if (LogoKey) {
    const { data } = useQuery(GET_OBJECT_QUERY, {
      variables: {
        key: LogoKey,
      },
    });

    LogoSrc = data?.getObject?.url;
  }

  const fallbackImageUrl = '/assets/images/users/user-1.jpg';
  const openModal = (idx) => {
    openUserModal(idx);
  };
  const truncateDescription = (text, wordCount) => {
    const words = text.split(' ');
    if (words.length > wordCount) {
      return words.slice(0, wordCount).join(' ') + '...';
    }
    return text;
  };

  return (
    <div className="max-w-md  h-[18rem] rounded-lg grid-rows-3 bg-white shadow-md dark:bg-slate-700">
      <div className="flex justify-start mb-2 p-4 ">
        <img
          src={LogoSrc ? LogoSrc : fallbackImageUrl}
          alt="Logo"
          className="w-24 h-24 object-fit rounded-full mr-4 "
        />

        <div className="flex h-[6rem] flex-col justify-between">
          <h4 className="text-slate-700  font-bold text-base md:text-2xl ">
            {item.title ? item.title : 'Partner Admin'}
          </h4>
          <p className="text-slate-500  dark:text-white text-sm lg:text-md w-fit mb-auto">
            {truncateDescription(item.description, 10)}
          </p>

          <p className="text-slate-500 dark:text-white mt-2">{item.id}</p>
        </div>
      </div>
      <div className=" flex w-full flex-col text-sm px-8 justify-between h-20">
        <div>
          <span className="text-slate-500 dark:text-slate-400 ">Type : </span>
          <span>{item.type ? item.type : 'Global'}</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400">
            Cerated By :{' '}
          </span>
          <span>
            {item?.createdBy?.email ? item?.createdBy?.email : 'Vineet'}
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400">
            Last Updated :{''}
          </span>
          <span>{item.updatedAt ? item.updatedAt : '27 nov 23.11:30 am'}</span>
        </div>
      </div>
      <div className="flex justify-between items-center p-4 px-8">
        <div
          className={`${
            item.status === 1
              ? 'text-success-600 bg-green-100 border border-success-600 rounded-md px-2'
              : 'text-danger-600  bg-danger-200 border border-danger-600 rounded-md px-2'
          } flex justify-center items-center `}
        >
          <Icon
            icon="heroicons-outline:clock"
            className={`${
              item.status === 1
                ? 'text-success-600 text-xl '
                : 'text-danger-600 text-xl '
            }  "pointer-events-none"`}
          />
          <span
            className={`${
              item.status === 1 ? 'text-success-600  ' : 'text-danger-600  '
            }`}
          >
            {item.status === 1 ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div>
          <Tooltip
            content="view & edit"
            placement="top"
            arrow
            animation="shift-away"
          >
            {/* <button
									className='action-btn border-none '
									type='button'
									// id={row?.row?.id}
									onClick={() => openUserModal(idx)}></button> */}
            <Button
              text={'View'}
              icon={'heroicons-outline:eye'}
              onClick={() => openModal(idx)}
              className={'w-fit h-9  btn btn-dark  text-white items-center '}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Card;
