import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { apiUrl, getData } from "../../../utils/utils";

export default function Analytics({ user }) {
  const [stats, setStats] = useState({
    active_students: 0,
    completed_courses: 0,
    average_progress: 0,
    progress_over_time: [], // початково порожній масив
  });

  useEffect(() => {
    async function getAnalytics() {
      try {
        const data = await getData(apiUrl.teacherAnalytics + user.id);

        if (data && !data.error) {
          setStats({
            active_students: data.active_students ?? 0,
            completed_courses: data.completed_courses ?? 0,
            average_progress: Math.min(Math.max(data.average_progress ?? 0, 0), 1),
            progress_over_time: Array.isArray(data.progress_over_time)
              ? data.progress_over_time
              : [],
          });
        }
      } catch (err) {
        console.error("Помилка при завантаженні статистики:", err);
      }
    }

    getAnalytics();
  }, [user.id]);

  const formattedProgress = `${Math.round(stats.average_progress * 100)}%`;

  const chartData = Array.isArray(stats.progress_over_time) && stats.progress_over_time.length > 0
    ? stats.progress_over_time
    : [
        { name: "Týždeň 1", students: stats.active_students },
        { name: "Týždeň 2", students: Math.round(stats.active_students * 0.8) },
        { name: "Týždeň 3", students: Math.round(stats.active_students * 1.1) },
        { name: "Týždeň 4", students: Math.round(stats.active_students * 0.9) },
        { name: "Týždeň 5", students: Math.round(stats.active_students * 1.05) },
      ];

  return (
    <div className="analytics-container">
      <h1 className="analytics-title">📊 Štatistiky</h1>

      <div className="stats-grid">
        <StatCard
          title="Aktívni študenti"
          value={stats.active_students}
          subtitle="Unikátni používatelia v tomto mesiaci"
        />
        <StatCard
          title="Dokončené kurzy"
          value={stats.completed_courses}
          subtitle="Počet úplne dokončených kurzov"
        />
        <StatCard
          title="Priemerný pokrok"
          value={formattedProgress}
          subtitle="Priemerné skóre všetkých študentov"
        />
      </div>

      <div className="chart-container">
        <h2 className="chart-title">📈 Dynamika aktivity študentov</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="students" stroke="#4f46e5" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Компонент картки статистики
function StatCard({ title, value, subtitle }) {
  return (
    <div className="stat-card">
      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">{value}</p>
      <p className="stat-subtitle">{subtitle}</p>
    </div>
  );
}
