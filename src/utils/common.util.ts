export const convertToTitleCase = (str: string) => {
  return str
    .replace("-", " ")
    .split(" ")
    .map(item => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
};
