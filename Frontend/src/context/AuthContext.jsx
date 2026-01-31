import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { connectSocket } from "../socket"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const fetchUser = async () => {
        try {
            const res = await api.get("/users/fetch-user")
            setUser(res.data.user)
            connectSocket(res.data.user)
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            await api.get("/users/logout")
        } catch (err) {
            console.error(err)
        } finally {
            setUser(null)
            navigate("/")
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)