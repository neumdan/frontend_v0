import { atom } from 'recoil';

const indicationsAtom = atom({
    key: 'indications',
    default: []
});

const donortypesAtom = atom({
    key: 'donortypes',
    default: []
});

const agegroupAtom = atom({
    key: 'agegroup',
    default: [
        { value: 'c', label: 'Children (< 18 years)' },
        { value: 'a', label: 'Adults (≥ 18 years)' },
        { value: 'n', label: 'Not specified' },
      ]
})

const countriesAtom = atom({
    key: 'countries',
    default: []
})

const allCountriesAtom = atom({
    key: 'allCountries',
    default: []
})

const regionsAtom = atom({
    key: 'regions',
    default: []
})

const allRegionsAtom = atom({
    key: 'allRegions',
    default: []
})

const reportAtom = atom({
    key: 'report',
    default: null
})

const reportlistAtom = atom({
    key: 'reportlist',
    default: []
})

const sheetAtom = atom({
    key: 'sheet',
    default: null
})

export {agegroupAtom, indicationsAtom, donortypesAtom, allCountriesAtom, allRegionsAtom, countriesAtom, regionsAtom, reportAtom, reportlistAtom, sheetAtom };