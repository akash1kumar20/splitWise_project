const SinglePreviousBill = ({ data }) => {
  return (
    <div className="border  p-2">
      {data.map((item) => (
        <div className="text-[16px] " key={item.id}>
          {item.user} contributed ₹{item.amount} .
        </div>
      ))}
      <p className="text-[16px]">No Other Contribution by any other user.</p>
    </div>
  );
};

export default SinglePreviousBill;
