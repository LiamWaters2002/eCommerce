import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
          <NavbarBrand tag={Link} to="/">eCommerceWebsite</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
            <ul className="navbar-nav flex-grow">
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/">Profile</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/counter">Counter</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/fetch-data">Fetch data</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/display-item">Display Items</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/display-user">Display Users</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/display-cart">Display Cart</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/display-order">Display Orders</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/item-page">Display Item</NavLink>
                </NavItem>
            </ul>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}
