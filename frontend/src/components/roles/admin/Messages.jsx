import React, { useEffect, useState } from "react";
import { apiUrl, getData, postData } from "../../../utils/utils";

export default function Messages() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    async function fetchTeachers() {
      const data = await getData(apiUrl.adminTeachersUnpublish);
      setTeachers(data?.error ? [] : data);
    }
    fetchTeachers();
  }, []);

  const handleStatusChange = async (teacherId, status) => {
    const response = await postData(apiUrl.adminTeachersUnpublish, { teacherId, publish: status });

    if (response?.message) {
      setTeachers(prevTeachers => prevTeachers.filter(teacher => teacher._id !== teacherId));
    }
  };

  return (
    <div className="users-container">
      <h3 className="title">Neaktívni učitelia</h3>
      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Meno</th>
              <th>Email</th>
              <th>Dátum registrácie</th>
              <th>Akcie</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(teacher => (
              <tr key={teacher._id}>
                <td className="user-name">
                  <div className="user-info">
                    <span className="user-text">{teacher.name}</span>
                  </div>
                </td>
                <td>{teacher.email}</td>
                <td><small>{teacher.created_at.slice(0, 10)}</small></td>
                <td className="actions-cell">
                  <div className="actions-buttons">
                    <button className="btn btn-sm" onClick={() => handleStatusChange(teacher._id, "yes")}>
                      Aktivovať
                    </button>
                    <button className="btn btn-sm" onClick={() => handleStatusChange(teacher._id, "canceled")}>
                      Odmietnuť
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
