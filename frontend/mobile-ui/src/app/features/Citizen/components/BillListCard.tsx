import React from 'react';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import '../../../../styles/Citizen/BillList.css';

export type Bill = {
  id: string;
  title: string;
  date: string;
  amount?: string;
};

const BillRow: React.FC<{ bill: Bill; onReceipt?: () => void }> = ({ bill, onReceipt }) => (
  <div className="bill-row">
    <div className="bill-left">
      <div className="bill-title">{bill.title}</div>
      <div className="bill-date">{bill.date}</div>
    </div>

    <div className="bill-right">
      {bill.amount && <div className="bill-amount">{bill.amount}</div>}
      <button className="receipt-button" onClick={onReceipt}>
        <VisibilityOutlinedIcon fontSize="small"/> <span>Receipt</span>
      </button>
    </div>
  </div>
);

const BillListCard: React.FC<{ bills: Bill[] }> = ({ bills }) => {
  return (
    <div className="bill-list-card" role="region" aria-label="Bills list">
      {bills.map((b, i) => (
        <React.Fragment key={b.id}>
          <BillRow bill={b} onReceipt={() => alert(`Receipt ${b.id}`)} />
          {i < bills.length - 1 && <div className="divider" />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default BillListCard;