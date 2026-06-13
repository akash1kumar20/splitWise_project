// ✅ Improved bill breakdown: shows direct spend, F&L amounts, and net contribution per user

const SinglePreviousBill = ({ data }) => {
  return (
    <div className="border p-2 text-left">
      {data.map((item) => (
        <div
          className="text-[15px] border-b border-gray-300 py-2 last:border-b-0"
          key={item.user}
        >
          <p className="font-bold text-base">{item.user}</p>
          <p className="ms-2">💰 Direct Spend: ₹{item.userAmount}</p>
          {item.userRelatedAmtVal > 0 && (
            <p className="ms-2 text-green-700">
              ↗ Lent / Covered for others: ₹{item.userRelatedAmtVal}
            </p>
          )}
          {item.relatedToAmtVal > 0 && (
            <p className="ms-2 text-red-600">
              ↙ Others covered for them: ₹{item.relatedToAmtVal}
            </p>
          )}
          <p className="ms-2 font-semibold">
            📊 Total Contributed: ₹
            {(item.userAmount || 0) + (item.userRelatedAmtVal || 0)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SinglePreviousBill;
