import { useNavigate } from "react-router-dom";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa"; // Іконка для редагування, перегляду та питання
import { useAuth } from "../context/AuthContext";
import { apiBaseUrl } from '../utils/utils';

export default function TopicCard({ topic, handleOpenModal }) {

  const { canRender } = useAuth();
  
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/course/${topic._id}`); // Перегляд курсу
  };

  const handleEditNavigate = (e) => {
    e.stopPropagation(); // Зупиняємо "бульбашку" події, щоб не спрацьовувало handleNavigate
    navigate(`/edit-course/${topic._id}`); // Перехід на сторінку редагування
  };

  const handleDelTopic = (e) => {
    handleOpenModal(topic); // Перехід на сторінку тестування
  };

  return (
    <div className="topic-card">
      <div className="img-cover topic-card-img-hold" onClick={handleNavigate}>
        <img
          src={topic.img ?? './img/no-image.jpg'}
          alt={topic.title}
          className="topic-card-img"
          style={{ width: "100%", borderRadius: "8px" }}
        />
      </div>
      <div className="topic-card-text-hold">
        <h3 className="topic-title" onClick={handleNavigate}>{topic.title}</h3>
        <p className="topic-description">{topic.description}</p>
      </div>

      {
        canRender(topic.created_by) && 
          <div className="topic-actions">
            <div className="btn-action btn-action-view" onClick={handleNavigate}>
              <FaEye size={18} />
            </div>
            <div className="btn-action btn-action-edit" onClick={handleEditNavigate}>
              <FaEdit size={18} />
            </div>

            <div className="btn-action btn-action-del" onClick={handleDelTopic}>
              <FaTrash size={18} />
            </div>
          </div>
      }
    </div>
  );
}
