import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { apiUrl, getData } from "../utils/utils";

const EditProfilePage = () => {
  const { user } = useAuth();
  const { id } = useParams(); // ID користувача з URL
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const isAdmin = user?.role === "admin"; // Перевірка ролі

  // Валідація
  const validationSchema = Yup.object({
    name: Yup.string().required("Meno je povinné"),
    email: Yup.string().email("Nesprávny formát e-mailu").required("Email обов'язковий"),
    password: Yup.string().min(6, "Heslo musí mať aspoň 6 znakov"),
    publish: Yup.string().when('role', {
      is: 'teacher',
      then: Yup.string().oneOf(['yes', 'no', 'canceled'], 'Neplatný status'),
    }),
  });

 
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const userId = id || user.id; // Якщо немає ID у URL, беремо поточного користувача

    async function fetchProfile() {
      try {
        const data = await getData(`${apiUrl.users}/${userId}`);
        setProfile(data);
      } catch (error) {
        console.error("Помилка отримання профілю:", error);
        navigate("/profile");
      }
    }

    fetchProfile();
  }, [id, user, navigate]);

  // Функція для оновлення профілю
  const handleSubmit = async (values) => {
    const userId = id || user.id; // Визначаємо, кого оновлюємо
    try {
      const response = await fetch(`${apiUrl.users}/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Помилка оновлення профілю");
      }

      window.location.href = "/profile";
    } catch (error) {
      console.error("Помилка оновлення профілю:", error);
    }
  };


  if (!profile) return <p>Завантаження...</p>;

 
  if (id && !isAdmin) {
    navigate("/profile");
    return null;
  }

  return (
    <div className="edit-container profile-edit">
      <div className="card">
        <h2 className="title">Upraviť profil</h2>
        <Formik
          initialValues={{
            name: profile.name,
            email: profile.email,
            password: "",
            publish: profile.role === 'teacher' ? profile.publish : '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="form">
              <Field name="name" type="text" placeholder="Ім'я" className={touched.name && errors.name ? "input error" : "input"} />
              {touched.name && errors.name && <div className="error-text">{errors.name}</div>}

              <Field name="email" type="email" placeholder="Email" className={touched.email && errors.email ? "input error" : "input"} />
              {touched.email && errors.email && <div className="error-text">{errors.email}</div>}

              <Field name="password" type="password" placeholder="Новий пароль" className={touched.password && errors.password ? "input error" : "input"} />
              {touched.password && errors.password && <div className="error-text">{errors.password}</div>}

              {isAdmin && profile.role === 'teacher' && (
                <Field
                  name="publish"
                  as="select"
                  className={touched.publish && errors.publish ? "input error" : "input"}
                >
                  <option value="">Vyberte status</option>
                  <option value="yes">Aktívny</option>
                  <option value="no">Neaktívny</option>
                  <option value="canceled">Zrušený</option>
                </Field>
              )}
              {touched.publish && errors.publish && <div className="error-text">{errors.publish}</div>}

              <div className="buttons mt-20 d-flex">
                <button type="submit" className="btn flex-stretch"> Uložiť</button>
                <button type="button" className="btn flex-stretch btn-gray" onClick={() => navigate("/profile")}>Zrušiť</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditProfilePage;
