const TableBody = ({ comingData }) => {
  return (
    <>
      {comingData.map((data, i) => (
        <table key={data.id}>
          <tbody>
            <tr>
              <td className="tableElementSide">{i + 1}</td>
              <td className="tableHeading">{data.date}</td>
              <td className="tableElementMain">
                {data.category}
                {data.relatedAmount && (
                  <p className="text-sm">(Related Amount)</p>
                )}
              </td>
              <td className="tableElementMain">{data.subCategory}</td>
              <td className="tableHeading">
                {!data.relatedAmount ? data.amount : data.relatedAmtVal}
                {data.relatedAmount && (
                  <p className="text-sm font-extrabold">
                    R/L - {data.relatedTo}
                  </p>
                )}
                {!data.relatedAmount && (
                  <p className="text-sm font-extrabold">P/M - {data.payBy}</p>
                )}
              </td>
              <td className="tableHeading ">{data.user}</td>
            </tr>
          </tbody>
        </table>
      ))}
    </>
  );
};

export default TableBody;
