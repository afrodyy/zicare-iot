export const getArrayBy = (arr, key, value) => {
    return arr.find((obj) => obj[key] === value);
};

export const delObjectArrayBy = (arr, key, value) => {
    return arr.filter((obj) => obj[key] !== value);
}