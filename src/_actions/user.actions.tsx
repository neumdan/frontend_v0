import axios from "axios";
import { useRecoilState, useSetRecoilState, useResetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { useDataActions } from '../_actions';

import { 
    // accountAtom, 
    authAtom, 
    usersAtom, 
    userAtom} from '../_state';

import { User } from '../types'


import jwt from 'jwt-decode'

function useUserActions () {
    // const authUrl = "https://gtr.nulyse.com/api/auth";
    const authUrl = "http://127.0.0.1:8000/api/auth";

    const userUrl = "/api/users";
    const [auth, setAuth] = useRecoilState(authAtom);
    // const setAccount = useSetRecoilState(accountAtom);

    const setUser = useSetRecoilState(userAtom);
    const resetUser = useResetRecoilState(userAtom);

    const navigate = useNavigate(); 
    const dataActions = useDataActions();
    // const [init, setInit] = useRecoilState(initAppAtom)


    return{
        login,
        logout,
        register,
        // getAll,
        // getById: getUserById,
        // getAccount,
        update,
        // delete: _delete,
        resetUsers: useResetRecoilState(usersAtom),
        resetUser: useResetRecoilState(userAtom),
        // resetAtom: useResetRecoilState(accountAtom)
    }

    async function login(email: string, password: string) {
        const response = await axios
            .post(authUrl + "/token/obtain/", { email, password })
        //message.success("Successful authenticated.");
        // console.log("User:", user);
        // set user as logged in
        setAuth(response.data);
        // sessionStorage.setItem("token", JSON.stringify(user.data))
        // sessionStorage.setItem("user", JSON.stringify(jwt(user.data.access)))
        // setUser(jwt(user.data.access));
        // eslint-disable no-unused-expressions
        const payload:any = jwt(response.data.access);
        const user:User = {
            'exp': payload.exp,
            'iat': payload.iat,
            'user_id': payload.user_id,
            'email': payload.email,
            'first_name': payload.first_name,
            'last_name': payload.last_name,
            'roles': payload.roles,
            'permissions': payload.permissions,
        }
        setUser(user)
        // setLoading(true);
        return navigate('/');
    }

    function logout() {
        // remove user from local storage, set auth state to null and redirect to login page
        // sessionStorage.removeItem("token")
        // sessionStorage.removeItem("user")
        setAuth(null);
        resetUser();
        dataActions.resetAllCountries();
        dataActions.resetAllRegions();
        dataActions.resetAllCenters();
        return navigate('/')
    }

    // function getAll() {
    //     return axios.get(`${userUrl}`).then(setUsers)
    // }

    function register(user: any) {
        return axios.post(`${userUrl}/register`, user);
    }

    // function getAccount() {
    //     return axios.get(`${accountUrl}`).then(setAccount)
    // }

    // function getUserById(id: number) {
    //     return axios.get(`${userUrl}/${id}`).then(setUser);
    // }

    async function update(id:number, params: any) {
        const x = await axios.put(`${userUrl}/${id}`, params);
        // update stored user if the logged in user updated their own record
        if (id === auth?.id) {
            // update local storage
            const user = { ...auth, ...params };
            // sessionStorage.setItem('token', JSON.stringify(user));
            // update auth user in recoil state
            setAuth(user);
        }
        return x;
    }

    // prefixed with underscored because delete is a reserved word in javascript
    // async function _delete(id:number) {
    //     setUsers(users => users.map(x => {
    //         // add isDeleting prop to user being deleted
    //         if (x.id === id) 
    //             return { ...x, isDeleting: true };
    //         return x;
    //     }));

    //     await fetchWrapper.delete(`${baseUrl}/${id}`);
    //     setUsers(users_1 => users_1.filter(x_1 => x_1.id !== id));
    //     // auto logout if the logged in user deleted their own record
    //     if (id === auth?.id) {
    //         logout();
    //     }
    // }
}

export { useUserActions };
