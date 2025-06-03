import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, MenuItem, IconButton, Typography } from "@mui/material";
import { PhotoCamera, AttachFile } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Container from "../components/Container";
import { RichTextEditor } from "@mantine/rte";
import parse from "html-react-parser";
import "../styles/RichTextStyles.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/utils";

export default function AddCourseForm() {
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // 🔹 новий стейт
  const [fileNames, setFileNames] = useState([]);
  const navigate = useNavigate();

  const { user } = useAuth();
  const isTeacherActive = user?.role === "teacher" && user?.publish === "yes"; // Перевірка на активного вчителя

  const CourseSchema = Yup.object().shape({
    title: Yup.string().required("Názov kurzu je povinný").max(100, "Názov kurzu môže mať maximálne 100 znakov"),
    description: Yup.string().max(500, "Popis kurzu môže mať maximálne 500 znakov"),
    videoLink: Yup.string(),
    img: Yup.mixed().nullable(),
    files: Yup.mixed().nullable(),
    article: Yup.string().max(10000, "Článok môže mať maximálne 1000 znakov"),
    publish: Yup.string().required("Vyberte možnosť publikovania").oneOf(["yes", "no"], "Publikovanie musí byť 'yes' alebo 'no'"),
  });

  useEffect(() => {
    if (!isTeacherActive && user?.role === "teacher") {
      toast.error("Váš účet nie je aktívny alebo je zablokovaný. Nemôžete pridávať kurzy.");
      setTimeout(() => {
        navigate("/profile");
      }, 3000);
    }
  }, [isTeacherActive, navigate]);

  function handleSubmit(values, { resetForm }) {
    setIsSubmitting(true); // 🔹 ставимо true
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("videoLink", values.videoLink);
    formData.append("publish", values.publish);
    formData.append("img", values.img);
    if (values.files) {
      Array.from(values.files).forEach((file) => {
        formData.append(`files`, file);
      });
    }
    formData.append("article", values.article);
    formData.append("createdBy", values.createdBy);

    fetch(apiUrl.courses, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Nová téma bola úspešne pridaná.");
          resetForm();
          setTimeout(() => {
            navigate('/courses');
          }, 2000);
        } else {
          toast.error("Nepodarilo sa pridať tému");
        }
      })
      .catch((error) => {
        console.error("Chyba pri pridávaní témy:", error);
        toast.error("Chyba pri pridávaní témy");
      })
      .finally(() => setIsSubmitting(false)); // 🔹 повертаємо до false
  }

  const RichTextDisplay = ({ article }) => (
    <div className="rich-text-container typography">
      {parse(article)}
    </div>
  );

  return (
    <section className="page-courses">
      <Container>
        <div className="content-hold">
          <div className="content">
            <Typography variant="h4" component="h1" gutterBottom>
              Pridať tému
            </Typography>

            <Formik
              initialValues={{
                title: "",
                description: "",
                videoLink: "",
                img: null,
                files: null,
                article: "",
                createdBy: String(user.id),
                publish: "no",
              }}
              validationSchema={CourseSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, setFieldValue }) => (
                <Form>
                  <div className="form-group">
                    <Field
                      name="title"
                      as={TextField}
                      label="Názov témy"
                      fullWidth
                      error={touched.title && !!errors.title}
                      helperText={<ErrorMessage name="title" />}
                    />
                  </div>

                  <div className="form-group">
                    <TextField
                      fullWidth
                      margin="normal"
                      select
                      name="publish"
                      label="Publikovať"
                      value={values.publish}
                      onChange={(event) => setFieldValue("publish", event.target.value)}
                      error={touched.publish && Boolean(errors.publish)}
                      helperText={touched.publish && errors.publish}
                    >
                      <MenuItem value="no">Nie</MenuItem>
                      <MenuItem value="yes">Ano</MenuItem>
                    </TextField>
                  </div>

                  <div className="form-group">
                    <Field
                      name="videoLink"
                      as={TextField}
                      label="Odkaz na video (voliteľné)"
                      fullWidth
                      error={touched.videoLink && !!errors.videoLink}
                      helperText={<ErrorMessage name="videoLink" />}
                    />
                  </div>

                  <div className="form-group">
                    <Field
                      name="description"
                      as={TextField}
                      label="Popis témy"
                      multiline
                      rows={4}
                      fullWidth
                      error={touched.description && !!errors.description}
                      helperText={<ErrorMessage name="description" />}
                    />
                  </div>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Typography variant="body1">Obrázok kurzu:</Typography>
                    <IconButton color="primary" component="label">
                      <PhotoCamera />
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          setFieldValue("img", file);
                          setPreviewImage(URL.createObjectURL(file));
                        }}
                      />
                    </IconButton>
                    {previewImage && <img src={previewImage} alt="Preview" width="50" height="50" style={{ borderRadius: '8px' }} />}
                  </div>

                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Typography variant="body1">Súbory (voliteľné):</Typography>
                    <IconButton color="primary" component="label">
                      <AttachFile />
                      <input
                        hidden
                        type="file"
                        multiple
                        onChange={(event) => {
                          const files = event.currentTarget.files;
                          setFieldValue("files", files);
                          setFileNames(Array.from(files).map(file => file.name));
                        }}
                      />
                    </IconButton>
                    {fileNames.length > 0 && <Typography variant="body2">{fileNames.join(", ")}</Typography>}
                  </div>

                  <div className="form-group">
                    <Typography variant="body1">Článok:</Typography>
                    <RichTextEditor
                      value={values.article}
                      onChange={(value) => setFieldValue("article", value)}
                      controls={[
                        ['bold', 'italic', 'underline', 'strike', 'clean'],
                        ['h3', 'h4'],
                        ['unorderedList', 'orderedList'],
                        ['link', 'image'],
                      ]}
                    />
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: "10px" }}>
                      Náhľad článku:
                    </Typography>
                    <RichTextDisplay article={values.article} />
                  </div>

                  <div className="form-group">
                    <button
                      type="submit"
                      className="btn"
                      disabled={isSubmitting || (!isTeacherActive && user?.role === "teacher")} // 🔹 дизейбл
                    >
                     {isSubmitting ? "Pridávam tému..." : "Pridať tému"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

            <ToastContainer />
          </div>
        </div>
      </Container>
    </section>
  );
}
