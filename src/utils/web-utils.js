export const getLocalStorageObject = (key) => {
  const objString = window.localStorage.getItem(key);
  if (!objString) {
    return null;
  }
  return JSON.parse(objString);
};

export const addItemToLocalStorage = (key, item) => {
  //Stringify items object then add to localStorage
  const existItem = localStorage.getItem(key);
  if (existItem) {
    removeItemFromLocalStorage(key);
  }
  if (typeof item !== 'object') {
    localStorage.setItem(key, item);
    return;
  }
  localStorage.setItem(key, JSON.stringify(item));
};

export const removeItemFromLocalStorage = (key) => {
  const inLocalStorage = localStorage.getItem(key);
  if (!inLocalStorage) {
    return;
  }
  localStorage.removeItem(key);
};

export const minimizeAddress = (address) => {
  if (address.length < 8) {
    return address
  }
  const start = address.slice(0, 4)
  const end = address.slice(-4)
  return `${start}...${end}`
}

export const minimizeAddressMedium = (address) => {
  if (address.length < 12) {
    return address
  }
  const start = address.slice(0, 6)
  const end = address.slice(-6)
  return `${start}...${end}`
}

export const formatNumber = (toFormat, currency) => {
  return `${toFormat.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} ${currency}`
}

export const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}


