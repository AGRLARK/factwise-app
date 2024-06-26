import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import userData from '../celebrities.json';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Create';
import SaveIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/HighlightOff';

const View = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [editedUser, setEditedUser] = useState(null);
    const [users, setUsers] = useState(userData);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [saveDisabled, setSaveDisabled] = useState(true); // State to control save button

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

        const userAge = calculateAge(user.dob);
        if (userAge < 18) {
            alert("You can only edit users who are adults (18 years or older).");
            return;
        }
        console.log(userId, editingUser, 'handle edit')
        if (editingUser === userId) {
            console.log('if block handle edit')
            if (editedUser?.description?.length != 0 || editedUser?.age?.length != 0 || editedUser?.country?.length != 0) setEditingUser(null);
            else setEditingUser(userId)
            const updatedUsers = users.map(user => {
                if (user.id === userId) {
                    return { ...editedUser };
                }
                return user;
            });
            setUsers(updatedUsers);
            setEditedUser(null);
            setSaveDisabled(true); // Disable save button after saving
        } else {
            console.log('else block handle edit')

            setEditingUser(userId);
            const user = users.find(user => user.id === userId);
            setEditedUser({ ...user });
            setSaveDisabled(true); // Disable save button when editing starts
        }
    }

    const handleInputChange = (e, key) => {
        const value = e.target.value;

        if (key === 'country') {
            if (/\d/.test(value)) {
                return;
            }
            setEditedUser(prevState => ({
                ...prevState,
                [key]: value
            }));
            setSaveDisabled(false);
        } else if (key === 'age') {
            if (!/^\d*$/.test(value)) {
                return;
            }
            const dobYear = value ? new Date().getFullYear() - parseInt(value) : '';
            const dobMonth = editedUser.dob ? editedUser.dob.split('-')[1] : '01';
            const dobDay = editedUser.dob ? editedUser.dob.split('-')[2] : '01';
            setEditedUser(prevState => ({
                ...prevState,
                dob: value ? `${dobYear}-${dobMonth}-${dobDay}` : '',
                [key]: value
            }));
            setSaveDisabled(false); // Enable save button when input changes
        } else {
            setEditedUser(prevState => ({
                ...prevState,
                [key]: value
            }));

            setSaveDisabled(false);
            // Enable save button when input changes
        }
    }


    const handleSaveClick = (userId) => {
        console.log(userId, 'handle save user id')
        if (editedUser?.description?.length == 0 || editedUser?.age?.length == 0 || editedUser?.country?.length == 0) {
            alert('do not leave empty');
            setEditingUser(userId)
            // return;
        } else {
            const updatedUsers = users.map(user => {
                if (user.id === editingUser) {
                    // if(edited)
                    return { ...editedUser };
                }
                return user;
            });
            // console.log(updatedUsers, editingUser, editedUser, 'updatedUsers')
            setUsers(updatedUsers);
            setEditingUser(null)
            setSaveDisabled(true); // Disable save button after saving
        }

    };

    const handleDeleteClick = (userId) => {
        setUserToDelete(userId);
        setShowDeleteConfirmation(true);
    };

    const confirmDelete = () => {
        const updatedUsers = users.filter(user => user.id !== userToDelete);
        setUsers(updatedUsers);
        setShowDeleteConfirmation(false);
    };

    const cancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    const cancelEdit = () => {
        console.log('cancel edi')
        setEditingUser(null);
        setEditedUser(null);
        setSaveDisabled(true); // Disable save button when editing is canceled
    };

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
                                                                value={calculateAge(editedUser.dob) || ''}
                                                                onChange={(e) => handleInputChange(e, 'age')}
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
                                                            disabled={editingUser === user.id && saveDisabled} // Disable save button if editing and saveDisabled is true
                                                            onClick={() => editingUser === user.id ? handleSaveClick(user.id) : handleEditClick(user.id)}
                                                        >
                                                            {editingUser === user.id ? <SaveIcon /> : <EditIcon />}
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
            {/* Delete Confirmation Dialog */}
            <Modal show={showDeleteConfirmation} onHide={cancelDelete}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body closeButton>
                    Are you sure you want to delete ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={cancelDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default View;
