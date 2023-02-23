//This hook will check if the user is logged in or not. If not, it will redirect to the login page.
// import { getLocalStorageObject } from '../utils/web-utils';
// import { FIREAL_ADMIN_PROFILE_KEY } from '../constants';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const usePrivateRoute = () => {
  const router = useRouter();
  const { isLoggedIn } = true // update logic here
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn]);
}

export default usePrivateRoute
