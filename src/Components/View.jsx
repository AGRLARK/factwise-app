
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import userData from '../celebrities.json';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Create';
import SaveIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/HighlightOff';


const View = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [editedUser, setEditedUser] = useState(null);
    const [users, setUsers] = useState(userData);



    const genders = ['Male', 'Female', 'Transgender', 'Rather not say', 'Other'];

    const calculateAge = (dateOfBirth) => {
        const dob = new Date(dateOfBirth);
        const today = new Date();

        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    }

    const handleEditClick = (userId) => {
        const user = users.find((user) => user.id === userId);

        // Check if the user is an adult (age > 18)
        const userAge = calculateAge(user.dob);
        if (userAge < 18) {
            alert("You can only edit users who are adults (18 years or older).");
            return;
        }
        if (editingUser === userId) {
            setEditingUser(null);
            const updatedUsers = users.map(user => {
                if (user.id === userId) {
                    return { ...editedUser };
                }
                return user;
            });
            setUsers(updatedUsers);
            setEditedUser(null);
        } else {
            setEditingUser(userId);
            const user = users.find(user => user.id === userId);
            setEditedUser({ ...user });
        }
    }
    const handleInputChange = (e, key) => {
        const value = e.target.value;

        if (key === 'country') {
            if (!/^[a-zA-Z\s]*$/.test(value)) {
                return;
            }
        }
        setEditedUser(prevState => ({
            ...prevState,
            [key]: value
        }));
    }

    const handleSaveClick = () => {
        const isEmpty = Object.values(editedUser).some(value => value === '');
        if (isEmpty) {
            alert('Please fill in all fields before saving.');
            return;
        }

        const updatedUsers = users.map(user => {
            if (user.id === editingUser) {
                return { ...editedUser };
            }
            return user;
        });
        setUsers(updatedUsers);
        setEditingUser(null);
        setEditedUser(null);
    };

    const handleDeleteClick = (userId) => {
        console.log('Deleted user:', userId);
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
    }

    const cancelEdit = () => {
        setEditingUser(null);
        setEditedUser(null);
    }

    return (
        <>
            <div className='view-container'>
                <div className='view-header  justify-content-center align-items-center'>
                    <div className='view-header-h'>
                        <h2 style={{ margin: '2rem 2rem 0rem ' }}>List View</h2>
                    </div>
                    <div>
                        <Form className="">
                            <Form.Control
                                type="search"
                                placeholder="Search user"
                                className="view-header-search m-4"
                                aria-label="Search"
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </Form>
                    </div>
                </div>
                <div className='view-section'>
                    <div className='view-section-accordion'>
                        <Accordion className='accordion'>
                            {users.filter(user => user.first.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map(user => (
                                    <div className='view-section-accordion-item' key={user.id}>
                                        <Accordion.Item eventKey={user.id.toString()} className={editingUser === user.id ? 'editing' : ''}>
                                            <div className="d-flex align-items-center">
                                                <div className="me-2">
                                                    <img src={user.picture} alt={user.first} style={{ width: '40px', height: '40px', margin: "1rem", borderRadius: '50%' }} />
                                                </div>
                                                <div className='view-section-header-name'>
                                                    <Accordion.Header>
                                                        {editingUser === user.id ? (
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={editedUser?.first || ''}
                                                                onChange={(e) => handleInputChange(e, 'first')}
                                                            />
                                                        ) : (
                                                            <p>{user.first}</p>
                                                        )}
                                                    </Accordion.Header>
                                                </div>
                                            </div>
                                            <Accordion.Body >
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <p style={{ color: "#969997" }}>Age </p>
                                                        {editingUser === user.id ? (
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={editedUser?.dob}
                                                                onChange={(e) => handleInputChange(e, 'dob')}
                                                            />
                                                        ) : (
                                                            <p>{calculateAge(user.dob)} Years</p>
                                                        )}
                                                    </div>
                                                    <div className="col-md-4">
                                                        <p style={{ color: "#969997" }}>Gender</p>
                                                        {editingUser === user.id ? (
                                                            <select
                                                                className="form-select"
                                                                value={editedUser?.gender}
                                                                onChange={(e) => handleInputChange(e, 'gender')}
                                                            >
                                                                {genders.map(gender => (
                                                                    <option key={gender} value={gender}>{gender}</option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <p>{user.gender}</p>
                                                        )}
                                                    </div>
                                                    <div className="col-md-4">
                                                        <p style={{ color: "#969997" }}>Country</p>
                                                        {editingUser === user.id ? (
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={editedUser?.country}
                                                                onChange={(e) => handleInputChange(e, 'country')}
                                                            />
                                                        ) : (
                                                            <p>{user.country}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col-md-12">
                                                        <p style={{ color: "#969997" }}>Description</p>
                                                        {editingUser === user.id ? (
                                                            <textarea
                                                                className="form-control"
                                                                value={editedUser?.description}
                                                                onChange={(e) => handleInputChange(e, 'description')}
                                                            />
                                                        ) : (
                                                            <p>{user.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12 d-flex justify-content-end">
                                                        <button
                                                            type="button"
                                                            className="btn outline-danger me-3"
                                                            style={{ color: 'red' }}
                                                            onClick={() => editingUser === user.id ? cancelEdit() : handleDeleteClick(user.id)}
                                                        >
                                                            {editingUser === user.id ? <CloseIcon onClick={cancelEdit} /> : <DeleteIcon />}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn outline-primary"
                                                            style={{ color: 'blue' }}
                                                            onClick={() => handleEditClick(user.id)}
                                                        >
                                                            {editingUser === user.id ? <SaveIcon onClick={handleSaveClick} /> : <EditIcon />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </Accordion.Body>

                                        </Accordion.Item>
                                    </div>
                                ))}
                        </Accordion>
                    </div>
                </div >
            </div >

        </>
    )
}

export default View