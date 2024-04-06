'use client'
import React, { Fragment } from "react";
import Icon from "@/components/ui/Icon";
import { Tab } from "@headlessui/react";
import {
  GET_ENTITY_DETAILS,
} from "@/configs/graphql/queries";
import { useQuery } from "graphql-hooks";
import SkeletionTable from "@/components/skeleton/Table";
import BasicDetails from "./BasicDetails";
import KYBData from "./KYBData";
import ListUsers from "./ListUsers";
import BlockchainChapter from './BlockchainChapter';


const buttons = [
  {
    title: 'Basic Details',
    icon: 'heroicons-outline:user',
  },
  {
    title: 'KYB Data',
    icon: 'heroicons-outline:circle-stack',
  },
  {
    title: 'List of Users',
    icon: 'heroicons-outline:list-bullet',
  },
  {
    title: 'Blockchain Chapter',
    icon: 'heroicons-outline:information-circle',
  },
];


function UserPage({ params }) {
  const identity = params.id;

  const { loading, error, data } = useQuery(GET_ENTITY_DETAILS, {
    variables: { id: identity },
  });

  if (loading) return <SkeletionTable />;
  if (error) return <pre>{error.message}</pre>;
  return (
    <div className="bg-transparent dark:bg-gray-900 p-5 mb-16">
      <Tab.Group>
        <Tab.List className="lg:space-x-8 md:space-x-4 space-x-0 rtl:space-x-reverse">
          {buttons.map((item, i) => (
            <Tab as={Fragment} key={i}>
              {({ selected }) => (
                <button
                  className={` inline-flex items-start text-base font-medium mb-7 capitalize dark:bg-transparent ring-0 foucs:ring-0 focus:outline-none px-6 transition duration-150 before:transition-all before:duration-150 relative before:absolute
                     before:left-1/2 before:bottom-[-6px] before:h-[1.5px]
                      before:bg-primary-500 before:-translate-x-1/2
              
              ${
                selected
                  ? 'text-primary-500 before:w-full'
                  : 'text-slate-500 before:w-0 dark:text-slate-300'
              }
              `}
                >
                  <span className="text-base relative top-[1px] ltr:mr-1 rtl:ml-1">
                    <Icon className="h-6 w-6" icon={item.icon} />
                  </span>
                  {item.title}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="text-slate-600 dark:text-slate-400 text-sm font-normal">
              <BasicDetails userData={data?.getEntity} />
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="text-slate-600 dark:text-slate-400 text-sm font-normal">
              <KYBData userData={data?.getEntity} />
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="text-slate-600 dark:text-slate-400 text-sm font-normal">
              <ListUsers />
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className=" dark:bg-gray-900 text-slate-600 dark:text-slate-400 text-sm font-normal">
              <BlockchainChapter entityData={data?.getEntity} />
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default UserPage;




