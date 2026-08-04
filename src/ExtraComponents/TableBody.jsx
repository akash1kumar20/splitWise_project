const TableBody = ({ comingData }) => {
  return (
    <>
      {comingData.map((data, i) => (
        <table key={data.id} className="w-full table-fixed">
          <colgroup>
            <col className="w-[6%]" />
            <col className="w-[14%]" />
            <col className="w-[22%]" />
            <col className="w-[14%]" />
            <col className="w-[19%]" />
            <col className="w-[25%]" />
          </colgroup>
          <tbody>
            <tr>
              <td className="tableElementSide">{i + 1}</td>
              <td className="tableHeading">{data.date}</td>
              <td className="tableElementMain">
                {data.category}
                {data.relatedAmount && (
                  <p className="text-sm">(F&L Entry)</p>
                )}
              </td>
              <td className="tableElementMain">{data.subCategory}</td>
              <td className="tableHeading">
                {!data.relatedAmount ? data.amount : data.relatedAmtVal}
                {data.relatedAmount && (
                  <p className="text-sm font-extrabold whitespace-nowrap">
                    F&L - {data.relatedTo}
                  </p>
                )}
                {!data.relatedAmount && (
                  <p className="text-sm font-extrabold whitespace-nowrap">
                    P/M - {data.payBy}
                  </p>
                )}
              </td>
              <td className="tableHeading break-words">{data.user}</td>
            </tr>
          </tbody>
        </table>
      ))}
    </>
  );
};

export default TableBody;
