const fetch = ({ q } = {}) =>
  new Promise((resolve, reject) => {
    const data = [
      { value: "apple" },
      { value: "pear" },
      { value: "orange" },
      { value: "grape" },
      { value: "banana" }
    ];
    if (q && typeof q !== "string") {
      reject(new Error("Param [q] must be a string."));
    }
    if (q) {
      setTimeout(
        resolve,
        500,
        data.filter((item, index) => {
          return item.value.includes(q);
        })
      );
    } else {
      setTimeout(resolve, 500, data);
    }
  });

export default fetch;
