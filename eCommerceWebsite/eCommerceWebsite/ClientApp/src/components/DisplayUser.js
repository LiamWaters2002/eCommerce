import React, { Component } from 'react';

export class DisplayUser extends Component {
    static displayName = DisplayUser.name;

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            users: [],
            selectedUser: null,
            editedUser: null, // Store the currently edited user
            showForm: false,
            editUserMode: false,
            newFirstName: '',
            newLastName: '',
            newEmail: '',
            newPassword: '',
            newFund: 0,
            newType: '',
            newUserStatus: 1,
        };
    }

    componentDidMount() {
        this.fetchUsers();
    }

    async fetchUsers() {
        try {
            const response = await fetch('https://localhost:7195/api/Users/GetUser'); // Replace with your API URL
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched users:', data); // Print the user data to the console
                this.setState({ users: data, loading: false });
            } else {
                console.error('Failed to fetch users.');
            }
        } catch (error) {
            console.error('An error occurred while fetching users:', error);
        }
    }

    async addUser(userData) {
        try {
            const response = await fetch('https://localhost:7195/api/Users/AddUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                this.fetchUsers();
            } else {
                console.error('Failed to add user.');
            }
        } catch (error) {
            console.error('An error occurred while adding the user:', error);
        }
    }

    async updateUser(userId, updatedUserData) {
        try {
            const response = await fetch(`https://localhost:7195/api/Users/UpdateUser/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUserData),
            });

            if (response.ok) {
                this.fetchUsers();
            } else {
                console.error('Failed to update user.');
            }
        } catch (error) {
            console.error('An error occurred while updating the user:', error);
        }
    }

    deleteUser = async () => {
        const { selectedUser } = this.state;

        if (!selectedUser) {
            console.error('No user selected for deletion.');
            return;
        }
        try {
            const response = await fetch(`https://localhost:7195/api/Users/DeleteUser/${selectedUser.ID}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                this.fetchUsers();
                this.setState({ selectedUser: null });
            } else {
                console.error('Failed to delete user.');
            }
        } catch (error) {
            console.error('An error occurred while deleting the user:', error);
        }
    }

    handleRadioChange = (event, selectedUser) => {
        this.setState((prevState) => {
            if (prevState.selectedUser === selectedUser) {
                return { selectedUser: null, editedUser: null };
            }
            return { selectedUser, editedUser: selectedUser };
        });
    };

    handleInputChange = (event, field) => {
        const { editedUser } = this.state;
        const updatedUser = { ...editedUser, [field]: event.target.value };
        this.setState({ editedUser: updatedUser });
    };

    handleNewUserChange = (field) => (event) => {
        this.setState({ [field]: event.target.value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        const newUserData = {
            FirstName: this.state.newFirstName,
            LastName: this.state.newLastName,
            Email: this.state.newEmail,
            Password: this.state.newPassword,
            Fund: parseFloat(this.state.newFund),
            Type: this.state.newType,
            Status: parseInt(this.state.newUserStatus),
            Createdon: new Date().toISOString(),
        };

        await this.addUser(newUserData);

        this.setState({
            newFirstName: '',
            newLastName: '',
            newEmail: '',
            newPassword: '',
            newFund: 0,
            newType: '',
            newUserStatus: 1,
            newCreatedon: ''
        });
    };

    toggleEdit = () => {
        this.setState((prevState) => ({
            editUserMode: true,
            showForm: false,
        }));
    };

    toggleForm = () => {
        this.setState((prevState) => ({
            showForm: true,
            editUserMode: false,
        }));
    };

    saveUserChanges = () => {
        const { editedUser } = this.state;
        this.updateUser(editedUser.ID, editedUser);
        this.setState({ editedUser: null });
    };

    editUser(user) {
        this.setState({ editedUser: user });
    }

    render() {
        let contents;

        if (this.state.loading) {
            contents = <p><em>Loading...</em></p>;
        } else {
            contents = this.renderUsersTable(this.state.users);
        }

        let formOrEditUser;

        if (this.state.showForm) {
            formOrEditUser = (
                <form onSubmit={this.handleSubmit}>
                    <h2>Add New User</h2>
                    <div className="form-group">
                        <label htmlFor="newFirstName">First Name:</label>
                        <input
                            type="text"
                            id="newFirstName"
                            value={this.state.newFirstName}
                            onChange={this.handleNewUserChange('newFirstName')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newLastName">Last Name:</label>
                        <input
                            type="text"
                            id="newLastName"
                            value={this.state.newLastName}
                            onChange={this.handleNewUserChange('newLastName')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newEmail">Email:</label>
                        <input
                            type="text"
                            id="newEmail"
                            value={this.state.newEmail}
                            onChange={this.handleNewUserChange('newEmail')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">Password:</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={this.state.newPassword}
                            onChange={this.handleNewUserChange('newPassword')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newFund">Fund:</label>
                        <input
                            type="text"
                            id="newFund"
                            value={this.state.newFund}
                            onChange={this.handleNewUserChange('newFund')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newType">Type:</label>
                        <input
                            type="text"
                            id="newType"
                            value={this.state.newType}
                            onChange={this.handleNewUserChange('newType')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newUserStatus">Status:</label>
                        <input
                            type="text"
                            id="newUserStatus"
                            value={this.state.newUserStatus}
                            onChange={this.handleNewUserChange('newUserStatus')}
                        />
                    </div>
                    <button type="submit">Add User</button>
                </form>
            );
        } else if (this.state.editedUser) {
            let editedUser = this.state.editedUser;
            formOrEditUser = (
                <div>
                    <h2>Edit User</h2>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name:</label>
                        <input
                            type="text"
                            id="firstName"
                            value={editedUser.FirstName}
                            onChange={(event) => this.handleInputChange(event, 'FirstName')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name:</label>
                        <input
                            type="text"
                            id="lastName"
                            value={editedUser.LastName}
                            onChange={(event) => this.handleInputChange(event, 'LastName')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="text"
                            id="email"
                            value={editedUser.Email}
                            onChange={(event) => this.handleInputChange(event, 'Email')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={editedUser.Password}
                            onChange={(event) => this.handleInputChange(event, 'Password')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fund">Fund:</label>
                        <input
                            type="text"
                            id="fund"
                            value={editedUser.Fund}
                            onChange={(event) => this.handleInputChange(event, 'Fund')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Type:</label>
                        <input
                            type="text"
                            id="type"
                            value={editedUser.Type}
                            onChange={(event) => this.handleInputChange(event, 'Type')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="userStatus">Status:</label>
                        <input
                            type="text"
                            id="userStatus"
                            value={editedUser.Status}
                            onChange={(event) => this.handleInputChange(event, 'Status')}
                        />
                    </div>
                    <button onClick={this.saveUserChanges}>Save</button>
                </div>
            );
        }

        return (
            <div>
                <h1 id="tableLabel">Users</h1>
                <p>This component demonstrates fetching data from the server.</p>
                {contents}

                <button onClick={this.toggleForm}>
                    {this.state.showForm ? <b>Add A New User</b> : 'Add A New User'}
                </button>

                <button onClick={this.toggleEdit} disabled={!this.state.selectedUser}>
                    {this.state.selectedUser ? (
                        this.state.editUserMode ? <b>Edit Selected User</b> : 'Edit Selected User'
                    ) : (
                        'Edit Selected User'
                    )}
                </button>

                <button onClick={this.deleteUser} disabled={!this.state.selectedUser}>
                    Delete Selected User
                </button>

                {formOrEditUser}
            </div>
        );
    }

    renderUsersTable(users) {
        const { selectedUser, editedUser } = this.state;

        return (
            <div>
                <table className='table table-striped' aria-labelledby="tableLabel">
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Fund</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>CreatedOn</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user =>
                            <tr key={user.id}>
                                <td>
                                    <input
                                        type="radio"
                                        name={`userRadio_${user.id}`}
                                        onChange={(event) => this.handleRadioChange(event, user)}
                                        checked={selectedUser && selectedUser.id === user.id}
                                    />
                                </td>
                                <td>{user.id}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.password}</td>
                                <td>{user.fund}</td>
                                <td>{user.type}</td>
                                <td>{user.status}</td>
                                <td>{user.createdon}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}
