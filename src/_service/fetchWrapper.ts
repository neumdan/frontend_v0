import { useRecoilState } from 'recoil';
import { authAtom } from '../_state';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function useFetchWrapper() {
    const [auth] = useRecoilState(authAtom);
    const navigate = useNavigate()

    return {
        // get: request('GET'),
        // post: request('POST'),
        // put: request('PUT'),
        // delete: request('DELETE'),
        get: request_axios('GET'),
        post: request_axios('POST'),
        put: request_axios('PUT'),
        delete: request_axios('DELETE')
    };

    // function request(method) {
    //     return (url, body) => {
    //         const requestConfig = {
    //             method,
    //             headers: authHeader()
    //         };
    //         if (body) {
    //             requestConfig.headers['Content-Type'] = 'application/json';
    //             requestConfig.body = JSON.stringify(body);
    //         }
    //         console.log("requestConfig", requestConfig)
    //         return fetch(url, requestConfig).then(handleResponse);
    //     }
    // }
    // 
    // function handleResponse(response) {
    //     console.log(response)
    //     return response.text().then(text => {
    //         const data = text && JSON.parse(text);
    //         console.log(response, data, text)
    //         if (!response.ok) {
    //             if ([401, 403].includes(response.status) && auth?.access) {
    //                 // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
    //                 //localStorage.removeItem('token');
    //                 //setAuth(null);
    //                 console.log("GOTO LOGIN");
    //                 navigate('/home', { replace: true })
    //             }
    //             const error = (data && data.message) || response.statusText;
    //             return Promise.reject(error);
    //         }
    //         return data;
    //     });
    // }

    function authHeader() {
        const token_access = auth?.access;
        //console.log('AUTH state:', auth, token_access)
        if (auth) {
          //const token = JSON.parse(localStorage.getItem('token'));
          //console.log("Token exists", token_access)
          return { Authorization: `Bearer ${token_access}`};
        } else {
          console.log("No token exists - AuthHeader = empty")
          return {};
        }
      }

    function request_axios(method: string) {
        return (url: string, data: any, params: any) => {
            const requestConfig = {
                method,
                headers: authHeader(),
                params,
                data,
            };
            if (params) {
                requestConfig.params = params;
            }
            if (data) {
                requestConfig.headers['Content-Type'] = 'application/json';
                requestConfig.data = JSON.stringify(data);
            }
            return axios(url, requestConfig)//.then(handleResponse_axios);
        }
    }
    // function handleResponse_axios(response: { data: any; statusText: any; status: number; }) {
    //         const data = response.data
    //         console.log(response, data)
    //         if (!response.statusText === "OK") {
    //             if ([401, 403].includes(response.status) && auth?.access) {
    //                 // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
    //                 //localStorage.removeItem('token');
    //                 //setAuth(null);
    //                 console.log("Trigger Token Refresh");
    //                 navigate('/home', { replace: true })
    //             }
    //             const error = (data && data.message) || response.statusText;
    //             return Promise.reject(error);
    //         }
    //         return data;
    // } 
}

export { useFetchWrapper };
