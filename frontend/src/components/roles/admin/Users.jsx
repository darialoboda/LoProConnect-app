import React, { useEffect, useState } from "react";
import { apiUrl, getData, getStatusColor } from "../../../utils/utils";
import { Link } from "react-router-dom";
import { Modal, Box, Typography } from "@mui/material";

export default function Users({ user }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    async function getUsers() {
      const data = await getData(apiUrl.users);
      setUsers(data);
    }
    getUsers();
  }, []);

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      const response = await fetch(`${apiUrl.users}/${selectedUser._id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setUsers(users.filter(user => user._id !== selectedUser._id));
      } else {
        alert("Chyba pri vymazaní používateľa");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Chyba pri vymazaní používateľa");
    }
    setSelectedUser(null);
  };

  return (
    <div className="users-container">
      <h3 className="title">Správa používateľov</h3>
      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Meno</th>
              <th>Email</th>
              <th>Rola</th>
              <th>Dátum registrácie</th>
              <th>Akcie</th>
            </tr>
          </thead>
          <tbody>
            {users.map(userData => (
              userData._id === user.id ? null : (
                <tr key={userData._id}>
                  <td className="user-name">
                    <div className="user-info">
                      <span className="user-text">{userData.name}</span>
                    </div>
                  </td>
                  <td>
                    {userData.email}
                    {userData.role === 'teacher' && (
                      <small className={`user-status status-${userData.publish}`}>
                        {getStatusColor(userData.publish)}
                      </small>
                    )}
                  </td>
                  <td>{userData.role}</td>
                  <td>{userData.created_at.slice(0, 10)}</td>
                  <td className="actions-cell">
                    <div className="actions-buttons">
                      <Link to={`/edit-profile/${userData._id}`} className="btn btn-sm">Upraviť</Link>
                      <button onClick={() => setSelectedUser(userData)} className="btn btn-red btn-sm">Vymazať</button>
                    </div>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
      
      <Modal
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
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
            Ste si istí, že chcete odstrániť používateľa "{selectedUser?.name}"?
          </Typography>
          <Box className="d-flex flex-center mt-20 gap-20">
            <button className='btn btn-gray' onClick={() => setSelectedUser(null)}>
              Zrušiť
            </button>
            <button className='btn btn-red' onClick={handleDelete}>
              Odstrániť
            </button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
