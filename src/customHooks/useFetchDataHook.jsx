import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const useFetchDataHook = (url) => {
  const [comingData, setComingData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        let res = await axios.get(url);
        if (res.status === 200) {
          setStatus(res.status);
        }
        const convertData = [];
        for (let key in res.data) {
          convertData.push({ ...res.data[key], id: key });
        }
        setComingData(convertData);
        setIsLoading(false);
      } catch (err) {}
    };
    fetchData();
    setInterval(fetchData, 2000);
  }, [url]);
  return [comingData, isLoading, status];
};

export default useFetchDataHook;
