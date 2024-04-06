import { Icon } from '@iconify/react';
import React from 'react';

const TransactionListItems = ({ data, key }) => {
  const amt = data.amount;
  const currency = data.coin.currency;
  const symbol = data.coin.symbol;
  const status = data.status;

  return (
    <div className="flex  items-start justify-start mb-6 ">
      <Icon icon={'cryptocurrency-color:eth'} className="text-3xl w-10 h-10" />
      <div className="flex flex-col ml-6">
        <span className="text-md">{`sent ${amt} ${currency}`}</span>
        <span className="text-xs text-gray-400">{symbol}</span>
      </div>
      <div className="ml-auto flex flex-col">
        <span className="text-xs text-gray-400">Status</span>
        {status === 1 ? (
          <span className="text-xs text-green-500">Confirmed</span>
        ) : (
          <span className="text-xs text-danger-500">Failed</span>
        )}
      </div>
    </div>
  );
};

export default TransactionListItems;
