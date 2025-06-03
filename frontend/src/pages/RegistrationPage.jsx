import React, { useState } from "react";
import { FaUserAlt, FaUserGraduate } from "react-icons/fa";
import Container from "../components/Container";
import { apiUrl } from "../utils/utils";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegistrationPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        navigate('/profile');
    }

    const [userRole, setUserRole] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRoleChange = (event) => {
        setUserRole(event.target.value);
    };

    const validatePassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const isLongEnough = password.length > 6;

        if (!hasUpperCase) {
            toast.error("Heslo musí obsahovať aspoň jedno veľké písmeno.");
            return false;
        }
        if (!hasNumber) {
            toast.error("Heslo musí obsahovať aspoň jedno číslo.");
            return false;
        }
        if (!isLongEnough) {
            toast.error("Heslo musí mať dĺžku aspoň 7 znakov.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validatePassword(password)) {
            return;
        }

        const newUser = {
            name: username,
            email,
            password,
            role: userRole,
        };

        try {
            const response = await fetch(apiUrl.register, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                toast.success("Registrácia bola úspešná!");
                if (userRole === "teacher") {
                    toast.info("Počkajte, kým admin schváli váš účet.");
                }
                setUsername("");
                setEmail("");
                setPassword("");
                setUserRole("");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                toast.error("Registrácia zlyhala. Skúste to znova.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Niečo sa pokazilo. Skúste to znova.");
        }
    };

    return (
        <div className="page-registration">
            <Container>
                <div className="content-hold">
                    <div className="registration-container">
                        <div className="registration-box">
                            <h2>Vytvorit si konto</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        placeholder="Tvoje meno : "
                                        required
                                        className="input"
                                        style={{ width: '300px', margin: '0 auto' }}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="input-group">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        className="input"
                                        style={{ width: '300px', margin: '0 auto' }}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        placeholder="Heslo"
                                        required
                                        className="input"
                                        style={{ width: '300px', margin: '0 auto' }}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="role-selection" style={{ textAlign: 'center' }}>
                                    <p>Vyber si svoju rolu:</p>
                                    <div className="role-options" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                                        <label className={`role-option ${userRole === "user" ? "selected" : ""}`} style={{ cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="role"
                                                value="user"
                                                checked={userRole === "user"}
                                                onChange={handleRoleChange}
                                            />
                                            <div className="role-icon" style={{ textAlign: 'center', margin: '5px 0' }}>
                                                <FaUserAlt size={30} />
                                            </div>
                                            <span>Študent</span>
                                        </label>
                                        <label className={`role-option ${userRole === "teacher" ? "selected" : ""}`} style={{ cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="role"
                                                value="teacher"
                                                checked={userRole === "teacher"}
                                                onChange={handleRoleChange}
                                            />
                                            <div className="role-icon" style={{ textAlign: 'center', margin: '5px 0' }}>
                                                <FaUserGraduate size={30} />
                                            </div>
                                            <span>Učiteľ</span>
                                        </label>
                                    </div>
                                </div>
                                <button type="submit" style={{ width: '150px', margin: '20px auto', display: 'block', backgroundColor: '#ebcd09', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                    Zaregistrovať sa
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Container>
            <ToastContainer />
        </div>
    );
}