const TableHead = () => {
  return (
    <table className="w-full table-fixed">
      <colgroup>
        <col className="w-[6%]" />
        <col className="w-[14%]" />
        <col className="w-[22%]" />
        <col className="w-[14%]" />
        <col className="w-[19%]" />
        <col className="w-[25%]" />
      </colgroup>
      <thead>
        <tr>
          <th className="tableElementSide">S.No</th>
          <th className="tableHeading">Date</th>
          <th className="tableElementMain">Category</th>
          <th className="tableElementMain">Note</th>
          <th className="tableHeading">Amount</th>
          <th className="tableHeading">Paid By</th>
        </tr>
      </thead>
    </table>
  );
};

export default TableHead;
