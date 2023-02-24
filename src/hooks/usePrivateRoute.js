// 
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getLocalStorageObject } from 'src/utils/web-utils';
import { TORDER_PROFILE } from 'src/constants';

const usePrivateRoute = () => {
  const router = useRouter();
  useEffect(() => {
    const isLoggedIn = !!getLocalStorageObject(TORDER_PROFILE)
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, []);
}

export default usePrivateRoute
