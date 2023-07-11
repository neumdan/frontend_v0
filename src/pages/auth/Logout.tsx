import { useUserActions } from '../../_actions'
import { Navigate } from 'react-router-dom'


const Logout = () => {
    const userActions = useUserActions();
    // const dataActions = useDataActions();
    
    userActions.logout();
    return <Navigate replace to="/" />;

}

export {Logout}