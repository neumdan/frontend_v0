import { atom } from 'recoil';

const centersAtom = atom({
    key: 'centers',
    default: []
});

const centerAtom = atom({
    key: 'center',
    default: {}
});

export { 
    centersAtom,
    centerAtom
};