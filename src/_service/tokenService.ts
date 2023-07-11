import { useRecoilState, useRecoilValue } from 'recoil';
import { authAtom } from '../_state';


function TokenService(token: any){
    return {
        getLocalRefreshToken: GetLocalRefreshToken(),
        getLocalAccessToken: GetLocalAccessToken(),
        updateLocalAccessToken: UpdateLocalAccessToken(token),
    }; 

    function GetLocalRefreshToken() {
        const auth = useRecoilValue(authAtom);
        // const user = JSON.parse(sessionStorage.getItem("user"));
        const refresh_token = auth?.refresh
        return refresh_token;
    }
    
    function GetLocalAccessToken() {
        const auth = useRecoilValue(authAtom);
        // const user = JSON.parse(sessionStorage.getItem("user"));
        const access_token = auth?.access
        return access_token
    }
    
    function UpdateLocalAccessToken(token: any) {
        const [auth, setAuth] = useRecoilState(authAtom);
        const new_auth = auth;
        new_auth.access = token;
        return setAuth(new_auth)
    }
}

export { TokenService };
  