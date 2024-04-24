import React from 'react'
import { useGetLoggedUserQuery } from '../Fetch_Api/Service/User_Auth_Api';
import { getToken} from '../Fetch_Api/Service/LocalStorageServices';
    const AuthLayout = ({children}) => {
    const { access_token } = getToken();
    const { data, isSuccess, isError, error } = useGetLoggedUserQuery(access_token);
    return React.Children.map(children, child =>
        React.cloneElement(child, { data })
    );
}

export default AuthLayout
