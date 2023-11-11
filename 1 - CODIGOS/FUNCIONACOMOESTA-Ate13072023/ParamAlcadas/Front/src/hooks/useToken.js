import { useSelector } from "react-redux";

/**
 * @returns {string} token
 */
export default function useToken() {
  // @ts-ignore
  return useSelector((state) => state.app.authState.token);
}
