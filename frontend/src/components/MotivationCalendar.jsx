import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; 


const templates = [
  "Napíšte 3 veci, za ktoré ste vďační",
"Prejdite sa na 15 minút a vyčistite si myseľ",
"Naučte sa jeden nový fakt o technológii LPWAN",
"Prečítajte si článok o inováciách vo vašom odbore",
"Strávte 10 minút meditovaním alebo cvičením všímavosti",
"Naplánujte si ciele na nasledujúci týždeň",
"Skontaktujte sa s priateľom a opýtajte sa, ako sa má",
];

const generateTaskForDate = (date) => {
  const dayOfMonth = date.getDate();
  const index = dayOfMonth % templates.length;
  return templates[index];
};

const MotivationCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyMotivation, setDailyMotivation] = useState("");

  useEffect(() => {
    // Генеруємо завдання для поточної дати при завантаженні сторінки
    setDailyMotivation(generateTaskForDate(new Date()));
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setDailyMotivation(generateTaskForDate(date));
  };

  return (
    <div className="calendar-section">
      <h3>Denná motivácia </h3>
      <p>Kliknite na dátum, aby ste videli svoju výzvu!</p>
      <Calendar onChange={handleDateChange} value={selectedDate} />
      <div className="motivation-task">
        {/* <h4>Motivacia na  {selectedDate.toDateString()}:</h4> */}
        <p>{dailyMotivation}</p>
      </div>
    </div>
  );
};

export default MotivationCalendar;
