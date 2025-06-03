import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faBook, faInfoCircle, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Container from "./Container";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user } = useAuth();
  const [hamburger, setHamburger] = useState(false);

  // Функція для закриття меню після переходу
  const closeMenu = () => setHamburger(false);

  return (
    <header className="header">
      <Container>
        <nav className="navbar">
          <Link to="/" className="logo" onClick={closeMenu}>LoProConnect</Link>
          <label className="hamburger">
            <input
              type="checkbox"
              checked={hamburger} 
              onChange={() => setHamburger(!hamburger)} />
            <svg viewBox="0 0 32 32">
              <path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
              <path className="line" d="M7 16 27 16"></path>
            </svg>
          </label>
          <ul className={`nav-links ${hamburger ? "active" : ""}`}>
            <li><Link to="/" onClick={closeMenu}><FontAwesomeIcon icon={faHome} /> Domov</Link></li>
            <li><Link to="/about" onClick={closeMenu}><FontAwesomeIcon icon={faInfoCircle} /> O stránke</Link></li>
            <li><Link to="/courses" onClick={closeMenu}><FontAwesomeIcon icon={faBook} /> Kurz</Link></li>
            <li><Link to="/motivation" onClick={closeMenu}><FontAwesomeIcon icon={faPhone} /> Motivácia</Link></li>
            <li>
              <Link to={user ? "/profile" : "/login"} className="register-icon-link" onClick={closeMenu}>
                <FontAwesomeIcon icon={faUser} size="lg" />
                {
                  user
                    ? <span className="username"> {user.name}</span>
                    : <span className="hide-pc">Autorizovať sa</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}
