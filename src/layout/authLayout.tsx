import { useGetLoggedUserQuery } from '@/fetch_Api/service/user_Auth_Api';
import { getToken} from '@/fetch_Api/service/localStorageServices';
    const AuthLayout = (UserData:any) => {
    const { access_token } = getToken();
    const { data } = useGetLoggedUserQuery(access_token);
    return(
        <UserData data={data}/>
    )
}

export default AuthLayout
