export function toExcelColName(n) {
  const ordA = 'a'.charCodeAt(0);
  const ordZ = 'z'.charCodeAt(0);
  const len = ordZ - ordA + 1;

  let s = "";
  while (n >= 0) {
    s = String.fromCharCode(n % len + ordA) + s;
    n = Math.floor(n / len) - 1;
  }
  return s.toUpperCase();
}
export function toIndexColName(colName) {
  const ordA = 'a'.charCodeAt(0);
  const ordZ = 'z'.charCodeAt(0);
  const len = ordZ - ordA + 1;

  let n = 0;
  for (let i = 0; i < colName.length; i++) {
    n = n * len + colName.charCodeAt(i) - ordA;
  }
  return n;
}
export function fromByteToMB(byte) {
  return (byte / 1024 / 1024).toFixed(2);
}
