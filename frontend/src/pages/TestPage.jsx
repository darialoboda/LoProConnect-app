import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Button, Container, Paper, Typography, Radio, FormControlLabel, RadioGroup, Box, Modal } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useParams } from 'react-router-dom';
import { apiUrl, getData } from '../utils/utils';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TestPage = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [course, setCourse] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [open, setOpen] = useState(false);
  
  const { user } = useAuth();

  useEffect(() => {
    async function fetchTestData() {
      try {
       // const testData = await getData(`${apiUrl.tests}${id}`);
       const testData = await getData(`${apiUrl.tests}/${id}`);
        const courseData = await getData(`${apiUrl.courseById}${testData.course_id}`);
        testData.questions = JSON.parse(testData.questions);
        setTest(testData);
        setCourse(courseData);
      } catch (error) {
        console.error("Error fetching test data:", error);
      }
    }
    fetchTestData();
  }, [id]);

  const handleSubmit = async (values) => {
    let correctCount = 0;
    const answersWithStatus = test.questions.map((question, index) => {
      const userAnswer = values.answers[index];
      const isCorrect = userAnswer === question.options[question.correctAnswerIndex];
      if (isCorrect) correctCount++;
      return {
        questionId: index,
        userAnswer,
        isCorrect
      };
    });

    const calculatedScore = ((correctCount / test.questions.length) * 100).toFixed(2);
    setScore(calculatedScore);
    setSubmitted(true);
    setOpen(true);

    try {
      await fetch(`${apiUrl.saveTestResults}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test_id: test._id,
          user_id: user.id,
          course_id: course._id,
          user_course_id: course.created_by,
          answers: answersWithStatus,
        }),
      });
    } catch (error) {
      console.error("Error saving answers:", error);
    }
  };

  if (!test) return <Typography variant="h5" align="center">Načítava sa test...</Typography>;

  const data = [
    { name: 'Správne odpovede', value: Number(score) },
    { name: 'Nesprávne odpovede', value: 100 - Number(score) }
  ];
  const COLORS = ['#4CAF50', '#F44336'];

  return (
    <Container component="main" maxWidth="md">
      <ToastContainer />
      <Paper elevation={2} sx={{ mt: 8, p: 4, borderRadius: '12px' }}>
        <Typography variant="h4" align="center" gutterBottom>{test.title}</Typography>
        <Formik
          initialValues={{ answers: Array(test.questions.length).fill("") }}
          onSubmit={(values) => {
            if (values.answers.some(answer => answer === "")) {
              toast.error("Musíte odpovedať na všetky otázky pred odoslaním!");
              return;
            }
            handleSubmit(values);
          }}
        >
          {({ values }) => (
            <Form>
              {test.questions.map((question, index) => (
                <Box key={index} sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    {index + 1}. {question.questionText}
                  </Typography>
                  <Field name={`answers[${index}]`}>
                    {({ field }) => (
                      <RadioGroup {...field}>
                        {question.options.map((option, optionIndex) => {
                          const isSelected = values.answers[index] === option;
                          const isCorrect = submitted && question.correctAnswerIndex === optionIndex;
                          const isWrong = submitted && isSelected && !isCorrect;
                          return (
                            <FormControlLabel
                              key={optionIndex}
                              value={option}
                              control={<Radio />}
                              label={option}
                              sx={{
                                color: isCorrect ? 'green' : isWrong ? 'red' : 'inherit'
                              }}
                            />
                          );
                        })}
                      </RadioGroup>
                    )}
                  </Field>
                </Box>
              ))}
              {!submitted && user?.role === "user" && (
                <div>
                  <button 
                    type="submit"
                    className="btn mt-40"
                  >
                    Potvrdiť odoslanie
                  </button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </Paper>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', p: 4, width: 400, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>Váš výsledok: {score}%</Typography>
          <PieChart width={300} height={300}>
            <Pie data={data} cx={150} cy={150} innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value" label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => setOpen(false)}>
            Zatvoriť
          </Button>
        </Paper>
      </Modal>
    </Container>
  );
};

export default TestPage;
