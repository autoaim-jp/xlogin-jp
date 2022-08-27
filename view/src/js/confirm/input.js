/* confirm/input.js */
export const fetchScope = ({ getRequest, apiEndpoint }) => {
  const url = `${apiEndpoint}/confirm/scope/list`
  return getRequest(url)
}

export default {}

