import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus, faUsers, faShoppingCart, faClipboardList, faDesktop } from '@fortawesome/free-solid-svg-icons';
import './NavMenu.css';
import { jwtDecode } from 'jwt-decode';

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true,
            username: '',
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    componentDidMount() {
        this.checkTokenExpiration();
    }

    checkTokenExpiration() {
        let token = localStorage.getItem('accessToken');
        let username = '';
        let timestamp = 0;
        let expirationTime = new Date();
        console.log("got here...");

        if (token) {
            let decodedToken = jwtDecode(token);
            console.log(decodedToken);
            username = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
            timestamp = decodedToken.exp;
            expirationTime = new Date(timestamp * 1000);
            console.log('Token expiration time (UTC):', expirationTime.toUTCString());

            let timeRemaining = expirationTime.getTime() - new Date().getTime();
            console.log("Time Remaining:" + timeRemaining);

            // Set a timeout to automatically log out the user when the token expires
            setTimeout(() => {
                this.setState({
                    username: '', // Clear the username in the component state
                });
                localStorage.removeItem('accessToken'); // Clear the token
            }, timeRemaining);
        }

        this.setState({
            username, // Update the username in the component state
        });
    }

    render() {

        let { username } = this.state;

        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
                    <NavbarBrand tag={Link} to="/">eCommerceWebsite</NavbarBrand>

                    <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                    <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
                        <ul className="navbar-nav flex-grow">

                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/">
                                    <FontAwesomeIcon icon={faUser} /> {username ? `Welcome, ${username}` : 'Profile'}
                                </NavLink>
                                </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/products">
                                    <FontAwesomeIcon icon={faPlus} /> Sell Items
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/display-users">
                                    <FontAwesomeIcon icon={faUsers} /> Sellers
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/display-cart">
                                    <FontAwesomeIcon icon={faShoppingCart} /> Your Basket
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/display-order">
                                    <FontAwesomeIcon icon={faClipboardList} /> Customer Orders
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/example-products">
                                    <FontAwesomeIcon icon={faDesktop} /> Shop
                                </NavLink>
                            </NavItem>
                        </ul>
                    </Collapse>
                </Navbar>
            </header>
        );
    }
}
