import { useRecoilValue } from 'recoil';
import { authAtom } from '../_state';


function AuthHeader() {

    const auth = useRecoilValue( authAtom );

    // check if authenticated state exists and if an access token is stored there
    if (auth && auth.access) {
      console.info("User is not authenticated.")
      return { Authorization: `Bearer ${auth.access}`};
    } else {
      console.error("User is not authenticated. No access token can be found to make encrypted API requests.")
      return {};
    }
  }

export { AuthHeader }