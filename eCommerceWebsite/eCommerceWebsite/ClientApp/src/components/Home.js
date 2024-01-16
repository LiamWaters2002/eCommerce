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

        try {
            // Prepare the login data
            let loginData = {
                "Email": this.state.loginEmail,
                "PasswordHash": this.state.loginPassword,
            };
            console.log("Login Data:", loginData);

            const response = await fetch('https://localhost:7195/api/Users/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const data = await response.json();

                if (data.token) {
                    // Store the token in local storage or cookies
                    localStorage.setItem('accessToken', data.token);
                    localStorage.setItem('username', data.username);

                    this.setState({
                        loginStatus: "Login successful",
                        loginMessage: "",
                    });
                } else {
                    this.setState({
                        loginStatus: "Incorrect details, try again",
                        loginMessage: "Unexpected response format",
                    });
                }

                const accessToken = localStorage.getItem('accessToken');
                const username = localStorage.getItem('username')
                console.log("Access Token: ", accessToken);
                console.log("Username: ", username)
            } else {
                const data = await response.json();
                this.setState({
                    loginStatus: "Incorrect details, try again: " + JSON.stringify(data.message),
                    loginMessage: JSON.stringify(data.message),
                });

                console.error("Login Status:", this.state.loginStatus);
                console.error("Login Message:", this.state.loginMessage);
            }
        } catch (error) {
            // Handle any exceptions that might occur during the asynchronous operations
            console.error("An error occurred during login:", error);
            this.setState({
                loginStatus: "An error occurred during login",
                loginMessage: error.message || "Unknown error",
            });
        }
    }

    // Move the handleRegistration method inside the class
    handleRegistration = async (event) => {
        event.preventDefault();

        // Prepare the registration data
        let registrationData = {
            "userName": this.state.registerFirstName + " " + this.state.registerLastName,
            "email": this.state.registerEmail,
            "passwordHash": this.state.registerPassword,
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
