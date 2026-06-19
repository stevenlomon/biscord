export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// export const YEARS = () => {
//   let years = [];
//   for (let i = 1926; i <= 2026; i++) {
//     years.push(i);
//   }
//   return years;
// };

const generateYears = (start = 1926, end = 2026) => 
  Array.from({ length: end - start + 1 }, (_, i) => i + start).reverse();

export const YEARS = generateYears();

const generateDays = (start = 1, end = 31) => 
  Array.from({ length: end - start + 1 }, (_, i) => i + start);

export const DAYS = generateDays();

export const MAX_CHARS_BIO = 190;