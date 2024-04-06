'use client';
import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { useMutation, useQuery } from 'graphql-hooks';
import {
  CREATE_WALLET_MUTATION,
  TRANSFER_ASSET,
} from '@/configs/graphql/mutations';
import { useDispatch, useSelector } from 'react-redux';

import WalletTransactionBtn from './_components/WalletTransactionBtn';

import Card from '@/components/ui/Card';
import Select from 'react-select';
import { Icon } from '@iconify/react';
import Accordion from '@/components/ui/Accordion';
import TokenAccordion from './_components/TokenAccordian';
import TransactionListItems from './_components/TransactionListItems';
import { Tab } from '@headlessui/react';
import copyText from '@/lib/copyText';
import { toast } from 'react-toastify';
import Tooltip from '@/components/ui/Tooltip';
import Button from '@/components/ui/Button';
import { setWallet } from '@/store/authReducer';
import CopyText from './_components/CopyText';
import TabBtn from './_components/TabBtn';

import { walletsData } from '@/constant/data';

import {
  LIST_ALL_COINS,
  LIST_ALL_TRANSACTIONS,
} from '@/configs/graphql/queries';
import SendModal from './_components/SendModal';
import ReceiveModal from './_components/ReceiveModal';

import NetworkSelect from './_components/NetworkSelect';
import chainOptions, { TEST_NET } from './_data/chainOptions';

const page = () => {
  const dispatch = useDispatch();
  const userCallback = useCallback((state) => state.auth.user, []);
  const user = useSelector(userCallback);
  const [selectedChain, setSelectedChain] = useState(TEST_NET);
  const { assetTabs, transactionButtons, items } = walletsData;

  const { data: txData } = useQuery(LIST_ALL_TRANSACTIONS, {
    variables: {
      input: {
        network: selectedChain.value,
      },
    },
  });

  //modal states
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

  //data fetching
  const {
    data: coinData,
    loading: coinLoading,
    error: coinFetchError,
  } = useQuery(LIST_ALL_COINS, {
    variables: {
      network: selectedChain.value,
    },
  });

  const [createWalletMutation] = useMutation(CREATE_WALLET_MUTATION, {});
  const createWallet = async () => {
    try {
      const { data } = await createWalletMutation({
        variables: {
          input: {
            email: user.email,
          },
        },
      });
      // console.log(data);
      dispatch(setWallet(data.createWallet.wallet));
    } catch (error) {
      // console.log(error);
    }
  };
  const defaultCoin = coinData?.listAllCoins?.balances.find(
    (coin) => coin.symbol === 'BBN'
  );

  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const handleClick = () => {
    setShowAllTransactions(!showAllTransactions);
  };

  return (
    <Card
      title={<p>BBN Wallet</p>}
      headerslot={
        <div className="flex gap-2 items-center ">
          <p>{user.email}</p>
          <NetworkSelect
            options={chainOptions}
            selectedOption={selectedChain}
            onChange={setSelectedChain}
          />
        </div>
      }
    >
      <Tab.Group>
        <Tab.List className="lg:space-x-8 md:space-x-4 space-x-0 rtl:space-x-reverse">
          {transactionButtons.map((item, i) => (
            <Tab as={Fragment} key={i}>
              {({ selected }) => (
                <button
                  className={` inline-flex items-start text-sm font-medium mb-7 capitalize bg-white dark:bg-slate-800 ring-0 foucs:ring-0 focus:outline-none px-2 transition duration-150 before:transition-all before:duration-150 relative before:absolute
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
                    <Icon icon={item.icon} />
                  </span>
                  {item.title}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="p-5 mb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 min-h-[70vh]">
              <Card
                className="col-span-1 md:col-span-2 lg:col-span-3 bg-white border dark:border-gray-700"
                title={
                  user.wallet.length > 0
                    ? `EVM Account`
                    : `You don't have any wallet yet, would you like to create one?`
                }
                subtitle={
                  user.wallet.length > 0 ? (
                    <div className="flex">
                      <strong className="mr-2">bbnAddress:</strong>
                      <CopyText text={coinData?.listAllCoins?.walletAddress} />
                    </div>
                  ) : null
                }
              >
                {user.wallet.length > 0 ? (
                  <>
                    <section className="flex flex-col items-start">
                      <div className="flex items-start">
                        <Icon
                          icon={'cryptocurrency-color:btc'}
                          className="text-5xl"
                        />
                        <div className="ml-6 mt-2">
                          <span className="text-2xl">
                            {defaultCoin?.balance}
                          </span>
                          <span className="text-sm text-gray-400">
                            {defaultCoin?.symbol}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between mt-8 w-1/5">
                        <WalletTransactionBtn
                          handleClick={() => {
                            setIsSendModalOpen(true);
                          }}
                          iconStr={'fluent:arrow-download-20-regular'}
                          label={'Send'}
                        />
                        <WalletTransactionBtn
                          handleClick={() => {
                            setIsReceiveModalOpen(true);
                          }}
                          iconStr={'fluent:arrow-upload-20-regular'}
                          label={'Receive'}
                        />
                      </div>
                    </section>
                    <section className="flex flex-col mt-10">
                      <Tab.Group>
                        <Tab.List className="lg:space-x-8 md:space-x-4 space-x-0 rtl:space-x-reverse">
                          {assetTabs.map((item, i) => (
                            <Tab as={Fragment} key={i}>
                              {({ selected }) => (
                                <TabBtn
                                  selected={selected}
                                  title={item.title}
                                />
                              )}
                            </Tab>
                          ))}
                        </Tab.List>
                        <Tab.Panels>
                          {assetTabs.map((_, i) => (
                            <Tab.Panel key={i}>
                              {coinData?.listAllCoins?.balances
                                .sort((a, b) => a.balance - b.balance)
                                .map((item, index) => (
                                  <TokenAccordion
                                    key={item?.symbol}
                                    item={item}
                                    index={index}
                                  />
                                ))}
                            </Tab.Panel>
                          ))}
                        </Tab.Panels>
                      </Tab.Group>
                    </section>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Button
                      text={'Create New Wallet'}
                      icon={'heroicons-outline:plus'}
                      className="btn btn-dark mx-auto "
                      // iconPosition='right'
                      onClick={createWallet}
                    />
                  </div>
                )}
              </Card>

              <Card
                title={'Transactions'}
                className="col-span-1 md:col-span-2 lg:col-span-2 bg-white max-h-[65vh] border dark:border-gray-700 overflow-y-auto "
              >
                {showAllTransactions
                  ? txData?.listAllTransactions?.map((item, i) => (
                      <TransactionListItems key={i} data={item} />
                    ))
                  : txData?.listAllTransactions
                      ?.slice(0, 5)
                      .map((item, i) => (
                        <TransactionListItems key={i} data={item} />
                      ))}

                <footer className="flex justify-center mt-auto ">
                  <a
                    href="#"
                    className="text-blue-500 underline"
                    onClick={handleClick}
                  >
                    {showAllTransactions
                      ? 'Show Less'
                      : 'View All Transactions'}
                  </a>
                </footer>
              </Card>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="text-slate-600 dark:text-slate-400 text-sm font-normal">
              Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et. Sunt
              qui esse pariatur duis deserunt mollit dolore cillum minim tempor
              enim.
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="text-slate-600 dark:text-slate-400 text-sm font-normal">
              Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et. Sunt
              qui
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="text-slate-600 dark:text-slate-400 text-sm font-normal">
              Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et. Sunt
              qui esse pariatur duis deserunt mollit dolore cillum minim tempor
              enim. Elit aute irure tempor cupidatat incididunt sint deserunt ut
              voluptate aute id deserunt nisi.
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      <SendModal
        isOpen={isSendModalOpen}
        setIsOpen={setIsSendModalOpen}
        env={selectedChain}
        walletAddress={coinData?.listAllCoins?.walletAddress}
      />
      <ReceiveModal
        isOpen={isReceiveModalOpen}
        setIsOpen={setIsReceiveModalOpen}
        env={selectedChain}
        walletAddress={coinData?.listAllCoins?.walletAddress}
      />
    </Card>
  );
};

export default page;
