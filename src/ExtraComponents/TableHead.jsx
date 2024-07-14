const TableHead = () => {
  return (
    <table>
      <thead>
        <tr>
          <th className="tableElementSide">S.No</th>
          <th className="tableHeading">Date</th>
          <th className="tableElementMain">Category</th>
          <th className="tableElementMain">Note</th>
          <th className="tableHeading">Amount</th>
          <th className="tableHeading">Spend By</th>
        </tr>
      </thead>
    </table>
  );
};

export default TableHead;
