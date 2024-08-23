const SinglePreviousBill = ({ data }) => {
  return (
    <div className="border  p-2">
      {data.map((item, i) => (
        <div className="text-[16px] " key={item.user}>
          {item.user} contributed ₹{item.userAmount}
        </div>
      ))}
    </div>
  );
};

export default SinglePreviousBill;
