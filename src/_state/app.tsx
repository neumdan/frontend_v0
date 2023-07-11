import { atom } from 'recoil';

const apploadingAtom = atom<boolean>({
    key: 'apploading',
    // get initial state from local storage to enable user to stay logged in
    default: false
});

const initAppAtom = atom<boolean>({
    key: 'initializeApp',
    // get initial state from local storage to enable user to stay logged in
    default: true
});

const centerSelectedAtom = atom<boolean>({
    key: 'centerSelected',
    default: false
})

const yearSelectedAtom = atom<boolean>({
    key: 'yearSelected',
    default: false
})

export { apploadingAtom, initAppAtom, centerSelectedAtom, yearSelectedAtom };