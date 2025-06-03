import React, { useEffect, useState } from "react";
import { Typography, Box, CircularProgress, Grid, Card, CardContent } from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { apiUrl, getData } from "../../../utils/utils";

export default function UserRole() {
  const { user } = useAuth();
  const [courseResults, setCourseResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserAnswers();
    }
  }, [user]);

  const fetchUserAnswers = async () => {
    try {
      const data = await getData(`${apiUrl.usersAnswers}${user.id}`);
      
      if (!data.answers || data.answers.length === 0) throw new Error("Žiadne údaje o odpovediach");

      const latestResults = {};
      data.answers.forEach(answer => {
        const parsedAnswers = JSON.parse(answer.answers);
        const correctCount = parsedAnswers.filter(item => item.isCorrect).length;
        const totalCount = parsedAnswers.length;
        const successRate = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

        latestResults[answer.course_title] = {
          courseTitle: answer.course_title,
          successRate,
        };
      });

      setCourseResults(Object.values(latestResults));
    } catch (error) {
      setError("Zatial nemate ziadne vysledky.");
      // toast.error("Nepodarilo sa načítať odpovede.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Posledné výsledky pre všetky kurzy
      </Typography>
      {courseResults.length > 0 ? (
        <Grid container spacing={3} justifyContent="center">
          {courseResults.map((result, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card sx={{ p: 2, boxShadow: 3, borderRadius: 3, textAlign: "center", mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">{result.courseTitle}</Typography>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={[{ name: "Úspešnosť", value: result.successRate }]}>
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="value" fill={result.successRate >= 50 ? "#4CAF50" : "#F44336"} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                  <Typography color={result.successRate >= 50 ? "success.main" : "error.main"}>
                    Úspešnosť: {result.successRate}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography color="textSecondary">Žiadne odpovede</Typography>
      )}
    </Box>
  );
}
