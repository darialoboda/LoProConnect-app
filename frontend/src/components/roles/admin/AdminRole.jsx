import { useState, lazy, Suspense } from "react";
import Loading from "../Loading";
import { useAuth } from "../../../context/AuthContext";

const Používatelia = lazy(() => import("./Users"));
const Témy = lazy(() => import("./Courses"));
const Správy = lazy(() => import("./Messages"));

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const handleTabChange = (index) => {
    setLoading(true);
    setTimeout(() => {
      setTab(index);
      setLoading(false);
    }, 400); 
  };

  return (
    <div className="dashboard-container">
      <div className="tabs">
        {['Používatelia', 'Témy', 'Správy'].map((label, index) => (
          <button
            key={index}
            className={`tab-button ${tab === index ? "active" : ""}`}
            onClick={() => handleTabChange(index)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {loading ? (
          <Loading />
        ) : (
          <Suspense fallback={<Loading />}>
            {tab === 0 && <Používatelia user={user} />}
            {tab === 1 && <Témy user={user} />}
            {tab === 2 && <Správy user={user} />}
          </Suspense>
        )}
      </div>
    </div>
  );
}