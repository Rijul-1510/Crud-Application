import React, { useEffect, useState } from "react";
import { Table, Button, Alert, Spinner } from "react-bootstrap";
import './fetchData.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

const toSentenceCase = str => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;
const toTitleCase = str => str ? str.toLowerCase().split(' ').map(toSentenceCase).join(' ') : str;

function FetchData() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    setLoading(true);
    fetch('http://localhost:5000/fetchData')
      .then(res => res.json())
      .then(data => setUserData(Array.isArray(data) ? data : []))
      .catch(err => setFetchError('Error fetching data: ' + err.message))
      .finally(() => setLoading(false));
  };

  const handleEditClick = (user) => {
    if (!user.id) return alert("User ID missing");
    navigate('/signup', { state: { initialFormData: user } });
  };

  const handleDeleteClick = (id) => {
    if (!id) return alert("User ID missing");
    if (window.confirm("Are you sure you want to delete this user?")) {
      fetch(`http://localhost:5000/deleteUser/${id}`, { method: 'DELETE' })
        .then(res => res.ok ? setUserData(data => data.filter(u => u.id !== id)) : alert("Error deleting user"))
        .then(() => setSuccessMessage('User deleted successfully!'))
        .catch(err => alert('Delete failed: ' + err.message));
    }
  };

  return (
    <div className="content">
      <div className="test">
        <div className="headers">
          <h3 className="heading">User Details</h3>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {fetchError && <Alert variant="danger">{fetchError}</Alert>}

          {loading ? (
            <div className="text-center my-4">
              <Spinner animation="border" />
              <div>Loading users...</div>
            </div>
          ) : userData.length === 0 ? (
            <div className="text-center my-4">No details found.</div>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Sr. No</th>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Circle</th>
                  <th>Hobbies</th>
                  <th>Document</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user, index) => (
                  <tr key={user.id || index}>
                    <td>{index + 1}</td>
                    <td>{toTitleCase(user.username) || 'N/A'}</td>
                    <td>{user.email || 'N/A'}</td>
                    <td>{toSentenceCase(user.gender) || 'N/A'}</td>
                    <td>{toTitleCase(user.circle) || 'N/A'}</td>
                    <td>{Array.isArray(user.hobbies) ? user.hobbies.map((h, i) => <div key={i}>{toTitleCase(h)}</div>) : toTitleCase(user.hobbies) || 'N/A'}</td>
                    <td>
                      {user.file ? (
                        <a href={`http://localhost:5000/uploads/${encodeURIComponent(user.file)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📄 
                        </a>
                      ) : (
                        'No File'
                      )}
                    </td>

                    <td>
                      <Button variant="primary" size="sm" onClick={() => handleEditClick(user)} disabled={!user.id}>Edit</Button>{' '}
                      <Button variant="danger" size="sm" onClick={() => handleDeleteClick(user.id)} disabled={!user.id}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}

export default FetchData;
