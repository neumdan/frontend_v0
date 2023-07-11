import { atom } from 'recoil';
import { User } from '../types'

const usersAtom = atom({
    key: 'users',
    default: []
});

const userAtom = atom<User>({
    key: 'user',
    default: null,
});

export {
    usersAtom,
    userAtom
};