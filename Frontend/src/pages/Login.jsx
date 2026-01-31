import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../services/api"
import { useAuth } from "../context/AuthContext"

const Login = () => {
    const navigate = useNavigate()
    const { setUser } = useAuth()

    const [phoneNumber, setPhoneNumber] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        if (!phoneNumber) {
            setError("Phone number is required")
            return
        }
        try {
            setLoading(true)
            const res = await api.post("/users/login", { phoneNumber }, { withCredentials: true })
            setUser(res.data.user)
            navigate("/home")
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
            >
                <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

                <input
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                {error && (
                    <p className="text-sm text-red-500 text-center mt-3">{error}</p>
                )}

                <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-md mt-6 hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-center text-sm mt-4">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-blue-600 hover:underline">Signup</Link>
                </p>
            </form>
        </div>
    )
}

export default Login