const TableBody = ({ comingData }) => {
  return (
    <>
      {comingData.map((data, i) => (
        <table key={data.id}>
          <tbody>
            <tr>
              <td className="tableElementSide">{i + 1}</td>
              <td className="tableHeading">{data.date}</td>
              <td className="tableElementMain">{data.category}</td>
              {data.subCategory.length > 0 && (
                <td className="tableElementMain">{data.subCategory}</td>
              )}
              {data.subCategory.length === 0 && (
                <td className="tableElementMain">___</td>
              )}
              <td className="tableHeading">
                {data.amount}
                <p className="text-sm font-extrabold">By - {data.payBy}</p>
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
