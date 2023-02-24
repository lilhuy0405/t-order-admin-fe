import { useState, useEffect } from 'react'
import { TORDER_PROFILE } from 'src/constants'
import torderApi from 'src/services/torderApi'
const useAuth = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const userJson = localStorage.getItem(TORDER_PROFILE)
        if (userJson) {
            setUser(JSON.parse(userJson).user)
        }
    }, [])

    const login = async (email, password) => {
        const data = await torderApi.login({ email, password })
        const userJson = JSON.stringify(data)
        localStorage.setItem(TORDER_PROFILE, userJson)
        setUser(data.user)
        return data
    }

    return { user, login }

}

export default useAuth