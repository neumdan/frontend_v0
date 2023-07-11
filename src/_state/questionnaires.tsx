import { atom } from 'recoil';

const questionnairesAtom = atom({
    key: 'questionnaires',
    default: []
});

const questionnaireAtom = atom({
    key: 'questionnaire',
    default: {}
});

export { 
    questionnairesAtom,
    questionnaireAtom
};