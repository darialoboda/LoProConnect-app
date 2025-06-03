import Container from "../components/Container";

export default function AboutPage() {
  return (
    <div className='page-about'>
      <Container>
        <div className="content-hold">
          <div className="content">
        
            <h1 className="title">Zoznámte sa so mnou a mojím kurzom</h1>
            <p className="subtitle">Nejde len o pripojenie. Ide o pochopenie. Začni s LoproConnect</p>

            <div className="card">
              <img
                src="/img/me.jpg"
                alt="Profile"
                className="profile-photo"
              />
              <h2 className="name">Kto vytvoril LoproConnect? </h2>
              <p className="description">
              Ahoj, volám sa Daria a pochádzam z Ukrajiny. Rozhodla som sa študovať informačné technológie na Slovensku – krajine,
               kde som objavila svoju vášeň pre LPWAN technológie.Vo svojej bakalárskej práci som sa rozhodla vytvoriť túto aplikáciu, 
               aby som priblížila fascinujúci svet Low-Power Wide-Area Networks každému, kto sa chce učiť, objavovať a porozumieť možnostiam ich využitia v reálnom svete.
              Verím, že LPWAN má potenciál zmeniť spôsob, akým naše zariadenia komunikujú – a s LoproConnect sa môžeš stať súčasťou tejto technologickej evolúcie.
              </p>
              {/* <button className="meet-button">Meet Me</button> */}
            </div>

            <div className="course-info">
              <h2 className="course-title">O kurze</h2>

              <div className="content-wrapper">             

                <div className="features">
                  <div id="feature-card-1" className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-paint-brush"></i>
                    </div>
                    <h3>1. O čom je tento kurz? </h3>
                    <p>Objav svet moderných LPWAN technológií! 
                      Ponor sa do základov aj pokročilých princípov s dôrazom na 
                      LTE-M a Wi-Fi HaLow – sieťové riešenia budúcnosti pre IoT a smart zariadenia. </p>
                  </div>
                  <div id="feature-card-2" className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-font"></i>
                    </div>
                    <h3>2. Pre koho je určený? </h3>
                    <p>Pre študentov techniky, vývojárov, 
                      učiteľov aj zvedavcov, ktorí chcú pochopiť,
                       ako sa spájajú veci okolo nás. Nezáleží, či si začiatočník alebo profík – každý si tu nájde to svoje.</p>
                  </div>
                  <div id="feature-card-3" className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-palette"></i>
                    </div>
                    <h3>3. Role: host, učiteľ, študent</h3>
                    <p>Každý má svoje miesto! Ako host môžeš kurz 
                      preskúmať, ako študent sa učiť a hodnotiť, a ako učiteľ zdieľať 
                      vedomosti a vytvárať obsah. Flexibilita pre každého, kto sa chce zapojiť. </p>
                  </div>
                  <div id="feature-card-4" className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-layer-group"></i>
                    </div>
                    <h3>4. Čo robí tento kurz výnimočným?</h3>
                    <p>Interaktívny obsah, prehľadné témy, možnosť pridávať vlastné poznámky 
                      a spolupracovať. Nie len učiť sa – ale aj tvoriť, zdieľať a rásť v komunite technológie budúcnosti.</p>
                  </div>
                </div>

                <div className="phone-image-container">
                  <img src="/img/mobil.jpg" alt="Phone" className="phone-image" />
                </div>
              </div>
              <p className="course-subtitle">
                Teším sa na vašu účasť a na to, ako spolu objavíme fascinujúci svet LPWAN!
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
