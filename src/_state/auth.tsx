import { atom } from 'recoil';

const authAtom = atom<any>({
    key: 'auth',
    // get initial state from local storage to enable user to stay logged in
    default: JSON.parse(localStorage.getItem('token'))
});

export { authAtom };