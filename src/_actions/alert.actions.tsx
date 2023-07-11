// The alert actions object returned by the useAlertActions() hook function contains methods for displaying a success or error alert, and a method to clear the alert message. The success() and error() methods call the setAlert() function to update the alert atom in Recoil state which is then rendered by the alert component. The clear() function resets the Recoil alert atom to it's default value (null).
//
// A React hook function is required because Recoil hook functions (e.g. useSetRecoilState, useResetRecoilState) can only be called within React components or hook functions.

import { useSetRecoilState, useResetRecoilState } from 'recoil';

import { alertAtom } from '../_state';

function useAlertActions () {
    const setAlert = useSetRecoilState(alertAtom);
    const resetAlert = useResetRecoilState(alertAtom);

    return {
        success: (message:any) => setAlert({ message, type: 'alert-success' }),
        error: (message:any) => setAlert({ message, type: 'alert-danger' }),
        clear: resetAlert
    }
}

export { useAlertActions };
