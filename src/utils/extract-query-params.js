export function extractQueryParams(query) {
  return query
    .substring(1)
    .split("&")
    .reduce((acc, param) => {
      const [key, value] = param.split("=");
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
}
