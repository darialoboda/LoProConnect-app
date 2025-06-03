import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Container from '../components/Container';
import { apiUrl, getData } from '../utils/utils';
import TopicCard from '../components/TopicCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  
  const { canRender } = useAuth();

  useEffect(() => {
    async function getCourses() {
      const data = await getData(apiUrl.courses);
      setTopics(data?.error ? [] : data);
    }
    getCourses();
  }, []);

  const filteredTopics = topics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery)
  );

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const handleOpenModal = (topic) => {
    setSelectedTopic(topic);
  };

  const handleCloseModal = () => {
    setSelectedTopic(null);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${apiUrl.courses}/${selectedTopic._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTopics((prevTopics) => prevTopics.filter((topic) => topic._id !== selectedTopic._id));
        toast.success('Téma bola úspešne odstránená.');
      } else {
        toast.error('Nepodarilo sa odstrániť tému.');
      }
    } catch (error) {
      toast.error('Chyba pri odstraňovaní témy.');
    } finally {
      handleCloseModal();
    }
  };

  return (
    <section className="page-courses">
      <Container>
        <div className="content-hold">
          <div className="header-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <h1 className="page-title">Témy LoProConnect</h1>
              <p className="page-description">
                Vyhľadajte tému podľa kľúčových slov alebo si vyberte tému.
              </p>
            </div>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Vyhľadajte kurz..."
              value={searchQuery}
              className='input'
              onChange={handleSearch}
            />
          </div>

          <div className="topics-grid">
            {filteredTopics.map((topic) => (
              <TopicCard key={topic._id} topic={topic} handleOpenModal={handleOpenModal} />
            ))}
          </div>

          {
            canRender() && 
              <div className='text-center px-20'>
                <Link to={"/add-course"} className='btn btn-round mt-40'>
                  <Tooltip title="Pridať temu">
                    <Add />
                  </Tooltip>
                </Link>
              </div>
          }
        </div>
      </Container>

      <Modal
        open={!!selectedTopic}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Ste si istí, že chcete odstrániť tému? "{selectedTopic?.title}"?
          </Typography>
          <Box className="d-flex flex-center mt-20 gap-20">
            <button className='btn btn-gray' onClick={handleCloseModal}>
              Zrušiť
            </button>
            <button className='btn btn-red' onClick={handleDelete}>
              Odstrániť
            </button>
          </Box>
        </Box>
      </Modal>

      <ToastContainer />
    </section>
  );
}
