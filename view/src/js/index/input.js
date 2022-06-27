/* index/input.js */  
export const fetchMemoContent = ({ apiEndpoint, getRequest, }) => {
  const url = apiEndpoint + '/index/getMemoContent'
  return getRequest(url)
}

