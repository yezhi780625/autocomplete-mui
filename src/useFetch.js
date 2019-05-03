import { useState, useEffect } from "react";

function useFetch({ fetchData, onSuccess, onError, initParams }) {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState(initParams);
  useEffect(() => {
    let didCancel = false;
    const query = async () => {
      setLoading(true);
      try {
        const res = await fetchData(params);
        if (!didCancel) {
          if (typeof onSuccess === "function") {
            onSuccess(res);
          }
        }
      } catch (e) {
        if (typeof onError === "function") {
          onError(e);
        }
      }
      setLoading(false);
    };
    query();
    return () => {
      didCancel = true;
    };
  }, [params, fetchData, onSuccess, onError]);
  return {
    loading,
    setParams
  };
}

export default useFetch;
