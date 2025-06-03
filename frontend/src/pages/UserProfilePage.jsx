import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import UserRole from "../components/roles/user/UserRole";
import TeacherRole from "../components/roles/teacher/TeacherRole";
import AdminRole from "../components/roles/admin/AdminRole";
import { FaSun, FaMoon } from "react-icons/fa"; // Іконки для теми
import { getStatusColor } from "../utils/utils";

const UserProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"; // Завантаження стану теми
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Функція для перемикання теми
  const toggleTheme = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode); // Збереження в localStorage
      return newMode;
    });
  };

  useEffect(() => {
    // Додавання або видалення класу в body
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    toast.success("Úspešne ste sa odhlásili!");
    navigate("/", { state: { message: "Úspešne ste sa odhlásili!" } });
  };

  const roleComponents = {
    admin: <AdminRole />,
    teacher: <TeacherRole />,
    user: <UserRole />
  };

  return (
    <div className={`page-profile ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div className="profile-container">
        <div className="profile-card">
          <div className="avatar">{user?.name?.[0] || "?"}</div>
          <h2 className="user-name">{user?.name || "Neznámy používateľ"}</h2>
          <p className="user-info">{user?.email || "Žiadny e-mail"}</p>
          <p className="user-info">Rola: {user?.role || "Neznáma"}</p>
          {
            user?.role === 'teacher' && 
              <p className="user-info">
                Status:
                <span className={`user-status status-${user.publish}`}>
                  {getStatusColor(user.publish)}
                </span>
              </p>
          }
          <div className="buttons">
            <Link className="btn btn-sm" to="/edit-profile">
              Upraviť
            </Link>
            <button className="btn btn-red btn-sm" onClick={handleLogout}>
              Odhlásiť sa
            </button>
          </div>
          <div className="role-section">
            {roleComponents[user?.role] || <p className="text-muted">Neznáma rola</p>}
          </div>
        </div>
      </div>

      {/* Кнопка для зміни теми */}
      <button onClick={toggleTheme} className="theme-toggle" title="Zmeniť tému">
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <ToastContainer />
    </div>
  );
};

export default UserProfilePage;
