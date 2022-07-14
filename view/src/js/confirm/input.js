/* confirm/input.js */
export const fetchScope = ({ getRequest, apiEndpoint }) => {
  const url = `${apiEndpoint}/confirm/scope/read`
  return getRequest(url)
}

