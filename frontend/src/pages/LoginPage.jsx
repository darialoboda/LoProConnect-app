import React, { useState } from "react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import Container from "../components/Container";
import { useAuth } from "../context/AuthContext"; // Імпортуємо хук
import { apiUrl } from "../utils/utils";

export default function LoginPage() {
    const { login } = useAuth(); // Використовуємо функцію login з контексту
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(apiUrl.login, { // Використовуємо правильне посилання
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            // Якщо авторизація успішна, викликаємо login з даними користувача та токеном
            login(data.user);

            // Зберігаємо токен у localStorage
            localStorage.setItem('token', data.token);

            // Перенаправляємо на головну сторінку
            window.location.href = "/"; // Можна використовувати React Router для навігації
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page-login">
            <Container>
                <div className="content-hold">
                    <div className="login-container">
                        <div className="login-box">
                            <h2 className="text-white">Prihlásiť sa</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginBottom: '10px' }}>
                                    <div className="icon"><FaUserAlt /></div>
                                    <input
                                        type="email"
                                        placeholder="Tvoj email"
                                        required
                                        className="input"
                                        style={{ width: '300px' }}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginBottom: '10px' }}>
                                    <div className="icon"><FaLock /></div>
                                    <input
                                        type="password"
                                        placeholder="Tvoje heslo"
                                        required
                                        className="input"
                                        style={{ width: '300px' }}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                                <button type="submit" className="btn w-100 mt-20">
                                    Prihlásiť sa
                                </button>
                            </form>
                            <p className="mt-20 text-center text-white">
                                Nemáš účet?{" "}
                                <a
                                    href="/register"
                                >
                                    Vytvor si ho!
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
