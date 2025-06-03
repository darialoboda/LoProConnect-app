import React, { useEffect, useState } from "react";
import { Formik, FieldArray, Form, Field } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Box,
  Typography,
  Container,
  Paper,
  FormControlLabel,
  RadioGroup,
  Radio,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { apiUrl, getData } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AddTestForm = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    async function fetchCourses() {
      const data = await getData((user?.role === 'admin') ? apiUrl.courses : apiUrl.courseTeacher + user.id);
      setCourses(data);
    }

    if(user) {
      fetchCourses();
    }
  }, [user]);

  const initialValues = {
    course_id: "",
    questions: [
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswerIndex: 0,
      },
    ],
  };

  const validationSchema = Yup.object({
    course_id: Yup.string().required("Required"),
    questions: Yup.array()
      .of(
        Yup.object({
          questionText: Yup.string().required("Required"),
          options: Yup.array().of(Yup.string().required("Required")),
          correctAnswerIndex: Yup.number().required("Required"),
        })
      )
      .required("Musí obsahovať aspoň jednu otázku"),
  });

  const onSubmit = async (values) => {
    try {
      const response = await fetch(apiUrl.tests, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        navigate(`/course/${values.course_id}`);
      }
    } catch (error) {
      console.error("Error adding test:", error);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
        Pridaj nový test
        </Typography>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <FormControl fullWidth margin="normal" error={touched.course_id && !!errors.course_id}>
                <InputLabel>Téma</InputLabel>
                <Field name="course_id" as={Select} label="Course">
                  {courses.map((course) => (
                      <MenuItem key={course._id} value={course._id}>
                        {course.title}
                      </MenuItem>
                  ))}
                </Field>
              </FormControl>
              <FieldArray name="questions">
                {({ push, remove }) => (
                  <>
                    {values.questions.map((question, index) => (
                      <Box key={index} sx={{ mt: 2, p: 2, border: "1px solid #ccc" }}>
                        <Typography variant="h6">Otázka {index + 1}</Typography>
                        <Field name={`questions.${index}.questionText`}>
                          {({ field }) => (
                            <TextField
                              {...field}
                              label="Text otázky"
                              fullWidth
                              margin="normal"
                              error={
                                touched.questions?.[index]?.questionText &&
                                !!errors.questions?.[index]?.questionText
                              }
                              helperText={
                                touched.questions?.[index]?.questionText &&
                                errors.questions?.[index]?.questionText
                              }
                            />
                          )}
                        </Field>
                        <RadioGroup
                          value={values.questions[index].correctAnswerIndex}
                          onChange={(e) =>
                            setFieldValue(
                              `questions.${index}.correctAnswerIndex`,
                              parseInt(e.target.value)
                            )
                          }
                        >
                          {question.options.map((option, optionIndex) => (
                            <Box key={optionIndex} sx={{ display: "flex", alignItems: "center" }}>
                              <FormControlLabel control={<Radio value={optionIndex} />} />
                              <Field name={`questions.${index}.options.${optionIndex}`}>
                                {({ field }) => (
                                  <TextField
                                    {...field}
                                    label={`Možnosť ${optionIndex + 1}`}
                                    fullWidth
                                    margin="normal"
                                    error={
                                      touched.questions?.[index]?.options?.[optionIndex] &&
                                      !!errors.questions?.[index]?.options?.[optionIndex]
                                    }
                                    helperText={
                                      touched.questions?.[index]?.options?.[optionIndex] &&
                                      errors.questions?.[index]?.options?.[optionIndex]
                                    }
                                  />
                                )}
                              </Field>
                            </Box>
                          ))}
                        </RadioGroup>
                        <button className="btn btn-sm" onClick={() => remove(index)}
                        >
                          Odstrániť otázku</button>
                      </Box>
                    ))}
                    <button className="btn btn-sm mr-20" onClick={() =>
                        push({
                          questionText: "",
                          options: ["", "", "", ""],
                          correctAnswerIndex: 0,
                        })
                      }
                    > Pridať otázku
                      </button>
                  </>
                )}
              </FieldArray>
              <button className="btn btn-ghost flex-stretch btn-back-sm" > Odoslať </button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default AddTestForm;