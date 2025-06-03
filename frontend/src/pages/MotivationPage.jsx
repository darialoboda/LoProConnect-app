import { FaQuoteLeft, FaCheckCircle } from 'react-icons/fa';
import Container from "../components/Container";
import MotivationCalendar from "../components/MotivationCalendar";

const MotivationSection = () => {
  const quotes = [
    "Úspech nie je kľúčom k šťastiu. Šťastie je kľúčom k úspechu. - Albert Schweitzer",
    "Nesleduj hodiny; rob to, čo robia. Pokračuj. - Sam Levenson",
    "Budúcnosť patrí tým, ktorí veria v krásu svojich snov. - Eleanor Roosevelt",
  ];

  const tips = [
    "Stanovte si malé, dosiahnuteľné ciele každý týždeň.",
    "Buďte zvedaví a neustále experimentujte s novými nápadmi.",
    "Spojte sa s ostatnými v komunite pre radu a podporu.",
    "Oslávte svoj pokrok, nech už je akokoľvek malý!",
  ];

  return (
    <div className="page-motivation">
      <Container>
        <div className="motivation-section">
          <h2 className="motivation-title">Zostaňte inšpirovaní a pokračujte vpred!</h2>

          <div className="content-wrapper">
            <div className="quote-section">
              <h3>Inšpiratívne citáty</h3>
              {quotes.map((quote, index) => (
                <div key={index} className="quote">
                  <FaQuoteLeft className="quote-icon" />
                  <p>{quote}</p>
                </div>
              ))}
            </div>

            <div className="tips-section">
              <h3> Praktické tipy pre úspech</h3>
              {tips.map((tip, index) => (
                <div key={index} className="tip">
                  <FaCheckCircle className="tip-icon" />
                  <p>{tip}</p>
                </div>
              ))}
            </div>
            <MotivationCalendar />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default MotivationSection;
