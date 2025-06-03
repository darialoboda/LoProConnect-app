import React, { useEffect, useState } from 'react';
import { IconButton, Modal, Box, Typography, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';
import TopicCard from '../../TopicCard';
import { apiUrl, getData } from '../../../utils/utils';

export default function Courses({ user }) {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    async function getCourses() {
      const data = await getData(apiUrl.courseTeacher + user.id);
      setTopics(data?.error ? [] : data);
    }
    getCourses();
  }, []);

  const handleOpenModal = (topic) => {
    setSelectedTopic(topic);
  };

  const handleCloseModal = () => {
    setSelectedTopic(null);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${apiUrl.courses}/${selectedTopic.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTopics((prevTopics) => prevTopics.filter((topic) => topic.id !== selectedTopic.id));
        toast.success('Kurz bol úspešne odstránený.');
      } else {
        toast.error('Nepodarilo sa odstrániť kurz.');
      }
    } catch (error) {
      toast.error('Chyba pri odstraňovaní kurzu.');
    } finally {
      handleCloseModal();
    }
  };

  return (
    <section className="tab-courses">
      {
        topics.length === 0
          ? <h2 className='text-center mt-40'>Nemáte žiadne vytvorené témy.</h2>
          : <div className="topics-grid">
            {
              topics.map((topic) => (
                <TopicCard topic={topic} key={topic.id} handleOpenModal={handleOpenModal} />
              ))
            }
          </div>
      }

      <Link to={"/add-course"} className='btn btn-round mt-20'>
        <Tooltip title="Pridať kurz">
          <Add />
        </Tooltip>
      </Link>


      <Modal
        open={!!selectedTopic}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{position: 'absolute',top: '50%',left: '50%',transform: 'translate(-50%, -50%)',width: 400,bgcolor: 'background.paper',boxShadow: 24,p: 4,borderRadius: 2,}}>
          <Typography id="modal-title" variant="h6" component="h2">
            Ste si istí, že chcete odstrániť kurz "{selectedTopic?.title}"?
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
  )
}
