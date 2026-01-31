import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../services/api"
import { useAuth } from "../context/AuthContext"

const Signup = () => {
    const navigate = useNavigate()
    const { setUser } = useAuth()

    const [form, setForm] = useState({
        userName: "",
        phoneNumber: ""
    })
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState("")
    const [loading, setLoading] = useState(false)

    const validate = () => {
        const err = {}
        if (!form.userName.trim()) err.userName = "Username is required"
        if (!form.phoneNumber.trim()) err.phoneNumber = "Phone number is required"
        if (form.phoneNumber.length !== 10) err.phoneNumber = "Enter valid phone number"
        return err
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: "" })
        setServerError("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationErrors = validate()
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors)
            return
        }
        try {
            setLoading(true)
            const res = await api.post("/users/sign-up", form, { withCredentials: true })
            setUser(res.data.user)
            navigate("/home")
        } catch (err) {
            setServerError(err.response?.data?.message || "Signup failed")
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
                <h2 className="text-2xl font-semibold text-center mb-6">Create Account</h2>

                <input
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    name="userName"
                    placeholder="Username"
                    value={form.userName}
                    onChange={handleChange}
                />
                {errors.userName && (
                    <p className="text-sm text-red-500 mt-1">{errors.userName}</p>
                )}

                <input
                    className="w-full px-4 py-2 border rounded-md mt-4 focus:ring-2 focus:ring-blue-500"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={form.phoneNumber}
                    onChange={handleChange}
                />
                {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
                )}
                {serverError && (
                    <p className="text-sm text-red-500 text-center mt-3">{serverError}</p>
                )}

                <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-md mt-6 hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Creating account..." : "Sign Up"}
                </button>

                <p className="text-center text-sm mt-4">
                    Already have an account?{" "}
                    <Link to="/" className="text-blue-600 hover:underline">Login</Link>
                </p>
            </form>
        </div>
    )
}

export default Signup