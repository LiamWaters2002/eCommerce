import React, { Component } from 'react';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            registerLastName: "",
            registerFirstName: "",
            registerEmail: "",
            registerPassword: "",
            registrationMessage: "",
            loginEmail: "",
            loginPassword: "",
            loginStatus: "",
            loginMessage: ""
        };
    }

    handleInputChange = (event) => {
        const { id, value } = event.target;
        this.setState({ [id]: value });
    };

    handleLogin = async (event) => {
        event.preventDefault();

        // Prepare the login data
        let loginData = {
            "email": this.state.loginEmail,
            "password": this.state.loginPassword,
        };

        const response = await fetch('https://localhost:7195/api/Users/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        if (response.ok) {
            this.setState({
                loginStatus: "Login successful",
                loginMessage: "",
            });
        } else {
            const data = await response.json();
            this.setState({
                loginStatus: "Incorrect details, try again",
                loginMessage: JSON.stringify(data),
            });
        }
    };

    handleRegistration = async (event) => {
        event.preventDefault();

        // Prepare the registration data
        let registrationData = {
            "id": 0,
            "firstName": this.state.registerFirstName,
            "lastName": this.state.registerLastName,
            "email": this.state.registerEmail,
            "password": this.state.registerPassword,
            "fund": 0,
            "type": "",
            "status": 0,
            "createdon": new Date().toISOString()
        };

        console.log(registrationData.createdon);

        // Send a POST request to the API
        const response = await fetch('https://localhost:7195/api/Users/Registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
        });

        if (response.ok) {
            this.setState({
                registrationMessage: 'User registered successfully',
            });
        } else {
            const data = await response.json();
            // Ensure that the data is converted to a string before setting it in the state
            this.setState({
                registrationMessage: JSON.stringify(data),
            });
        }
    };


    render() {
        return (
            <div>
                <h1>Welcome to Your Website</h1>
                <h2>Register or login to access your basket...</h2>

                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h2>Login</h2>
                                <form onSubmit={this.handleLogin}>
                                    <div className="form-group">
                                        <label htmlFor="loginEmail">Email:</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="loginEmail"
                                            value={this.state.loginEmail}
                                            onChange={this.handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="loginPassword">Password:</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="loginPassword"
                                            value={this.state.loginPassword}
                                            onChange={this.handleInputChange}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Login</button>
                                </form>
                                <div className={this.state.loginStatus === "Login successful" ? "text-success" : "text-danger"}>
                                    {this.state.loginStatus}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h2>Register</h2>
                                <form onSubmit={this.handleRegistration}>
                                    <div className="form-group">
                                        <label htmlFor="registerFirstName">First Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="registerFirstName"
                                            value={this.state.registerFirstName}
                                            onChange={this.handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="registerLastName">Last Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="registerLastName"
                                            value={this.state.registerLastName}
                                            onChange={this.handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="registerEmail">Email:</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="registerEmail"
                                            value={this.state.registerEmail}
                                            onChange={this.handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="registerPassword">Password:</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="registerPassword"
                                            value={this.state.registerPassword}
                                            onChange={this.handleInputChange}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Register</button>
                                </form>
                                <div>{this.state.registrationMessage}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
