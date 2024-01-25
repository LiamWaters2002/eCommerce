import React, { Component } from 'react';

export class DisplayOrder extends Component {
    static displayName = DisplayOrder.name;

    constructor(props) {
        super(props);
        this.state = {
            loadingOrders: true,
            loadingItems: true,
            loadingUsers: true,
            orders: [],
            items: [],
            users: [],
            selectedOrder: null,
            editedOrder: null, // Store the currently edited order
            showForm: false,
            editOrderMode: false,
        };
    }

    // Run when the component is mounted onto the DOM.
    componentDidMount() {
        this.fetchOrders();
        this.fetchItems();
        this.fetchUsers();
    }

    async fetchUsers() {
        try {
            const response = await fetch('https://localhost:7195/api/Users/GetUser'); // Replace with your API URL
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched users:', data); // Print the user data to the console
                this.setState({ users: data, loadingUsers: false });
            } else {
                console.error('Failed to fetch users.');
            }
        } catch (error) {
            console.error('An error occurred while fetching users:', error);
        }
    }

    async fetchOrders() {
        try {
            const response = await fetch('https://localhost:7195/api/Order/GetOrders'); // Replace with your API URL
            if (response.ok) {
                const data = await response.json();
                this.setState({ orders: data, loadingOrders: false });
            } else {
                // Handle error here
                console.error('Failed to fetch orders.');
            }
        } catch (error) {
            console.error('An error occurred while fetching orders:', error);
        }
    }

    async fetchItems() {
        try {
        const response = await fetch('https://localhost:7195/api/Item/GetItems')
            if (response.ok) {
                const data = await response.json();
                this.setState({ items: data, loadingItems: false });
            } else {
                // Handle error here
                console.error('Failed to fetch items.');
            }
        } catch (error) {
            console.error('An error occurred while fetching items:', error);
        }
    }

    async addOrder(orderData) {
        try {
            const response = await fetch('https://localhost:7195/api/Order/PlaceOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                // Order added successfully, you can handle this as needed
                // You may want to refresh the order list after adding
                this.fetchOrders();
            } else {
                // Handle error here
                console.error('Failed to add order.');
            }
        } catch (error) {
            console.error('An error occurred while adding the order:', error);
        }
    }

    async updateOrder(orderId, updatedOrderData) {
        try {
            const response = await fetch(`https://localhost:7195/api/Order/UpdateOrder/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedOrderData),
            });

            if (response.ok) {
                // Order updated successfully, you can handle this as needed
                // You may want to refresh the order list after updating
                this.fetchOrders();
            } else {
                // Handle error here
                console.error('Failed to update order.');
            }
        } catch (error) {
            console.error('An error occurred while updating the order:', error);
        }
    }

    deleteOrder = async () => {
        const { selectedOrder } = this.state;

        if (!selectedOrder) {
            console.error('No order selected for deletion.');
            return;
        }
        try {
            const response = await fetch(`https://localhost:7195/api/Order/DeleteOrder/${selectedOrder.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Order deleted successfully, you can handle this as needed
                // You may want to refresh the order list after deleting
                this.fetchOrders();
                this.setState({ selectedOrder: null });
            } else {
                // Handle error here
                console.error('Failed to delete order.');
            }
        } catch (error) {
            console.error('An error occurred while deleting the order:', error);
        }
    }

    handleRadioChange = (event, selectedOrder) => {
        this.setState((prevState) => {
            // If the same radio button is clicked again, deselect it
            if (prevState.selectedOrder === selectedOrder) {
                console.log('Deselecting radio button');
                return { selectedOrder: null, editedOrder: null };
            }
            console.log('Selecting radio button');
            return { selectedOrder, editedOrder: selectedOrder };
        });
    };

    handleInputChange = (event, field) => {
        const { editedOrder } = this.state;
        const updatedOrder = { ...editedOrder, [field]: event.target.value };
        this.setState({ editedOrder: updatedOrder });
    };

    handleNewOrderChange = (field) => (event) => {
        this.setState({ [field]: event.target.value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        const newOrderData = {
            name: this.state.newOrderName,
            manufacturer: this.state.newOrderManufacturer,
            unitPrice: parseFloat(this.state.newOrderUnitPrice), // Assuming unitPrice is a number
            discount: parseFloat(this.state.newOrderDiscount), // Assuming discount is a number
            quantity: parseInt(this.state.newOrderQuantity), // Assuming quantity is an integer
            description: this.state.newOrderDescription,
            imageURL: this.state.newOrderImageURL,
            status: this.state.newOrderStatus,
        };

        // Send a POST request to add the order
        await this.addOrder(newOrderData);

        // Clear the form fields
        this.setState({
            newOrderName: '',
            newOrderManufacturer: '',
            newOrderUnitPrice: '',
            newOrderDiscount: '',
            newOrderQuantity: '',
            newOrderDescription: '',
            newOrderImageURL: '',
            newOrderStatus: '',
        });
    };

    toggleEdit = () => {
        this.setState((prevState) => ({
            editOrderMode: true,
            showForm: false,
        }));
    };

    toggleForm = () => {
        this.setState((prevState) => ({
            showForm: true,
            editOrderMode: false,
        }));
    };

    saveOrderChanges = () => {
        const { editedOrder } = this.state;
        this.updateOrder(editedOrder.id, editedOrder);
        this.setState({ editedOrder: null });
    };

    editOrder(order) {
        this.setState({ editedOrder: order });
    }

    render() {
        let contents;

        if (this.state.loadingOrders && this.state.loadingItems && this.state.loadingUsers) {
            contents = <p><em>Loading...</em></p>;
        } else {
            console.log(this.state.items)
            contents = this.renderOrdersTable(this.state.orders, this.state.items, this.state.users);
        }

        let formOrEditOrder;

        //Change this to increase/decrease quantity of order...
        if (this.state.showForm) {
            formOrEditOrder = (
                <form onSubmit={this.handleSubmit}>
                    <h2>Add New Order</h2>
                    <div className="form-group">
                        <label htmlFor="newName">Name:</label>
                        <input
                            type="text"
                            id="newName"
                            value={this.state.newOrderName}
                            onChange={this.handleNewOrderChange('newOrderName')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newManufacturer">Manufacturer:</label>
                        <input
                            type="text"
                            id="newManufacturer"
                            value={this.state.newOrderManufacturer}
                            onChange={this.handleNewOrderChange('newOrderManufacturer')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newUnitPrice">Unit Price:</label>
                        <input
                            type="text"
                            id="newUnitPrice"
                            value={this.state.newOrderUnitPrice}
                            onChange={this.handleNewOrderChange('newOrderUnitPrice')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newDiscount">Discount:</label>
                        <input
                            type="text"
                            id="newDiscount"
                            value={this.state.newOrderDiscount}
                            onChange={this.handleNewOrderChange('newOrderDiscount')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newQuantity">Quantity:</label>
                        <input
                            type="text"
                            id="newQuantity"
                            value={this.state.newOrderQuantity}
                            onChange={this.handleNewOrderChange('newOrderQuantity')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newDescription">Description:</label>
                        <input
                            type="text"
                            id="newDescription"
                            value={this.state.newOrderDescription}
                            onChange={this.handleNewOrderChange('newOrderDescription')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newImageURL">Image URL:</label>
                        <input
                            type="text"
                            id="newImageURL"
                            value={this.state.newOrderImageURL}
                            onChange={this.handleNewOrderChange('newOrderImageURL')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newStatus">Status:</label>
                        <input
                            type="text"
                            id="newStatus"
                            value={this.state.newOrderStatus}
                            onChange={this.handleNewOrderChange('newOrderStatus')}
                        />
                    </div>
                    <button type="submit">Add Order</button>
                </form>
            );
        } else if (this.state.editedOrder) {
            let editedOrder = this.state.editedOrder;
            formOrEditOrder = (
                <div>
                    <h2>Edit Order</h2>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={editedOrder.name}
                            onChange={(event) => this.handleInputChange(event, 'name')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="manufacturer">Manufacturer:</label>
                        <input
                            type="text"
                            id="manufacturer"
                            value={editedOrder.manufacturer}
                            onChange={(event) => this.handleInputChange(event, 'manufacturer')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="unitPrice">Unit Price:</label>
                        <input
                            type="text"
                            id="unitPrice"
                            value={editedOrder.unitPrice}
                            onChange={(event) => this.handleInputChange(event, 'unitPrice')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="discount">Discount:</label>
                        <input
                            type="text"
                            id="discount"
                            value={editedOrder.discount}
                            onChange={(event) => this.handleInputChange(event, 'discount')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                            type="text"
                            id="quantity"
                            value={editedOrder.quantity}
                            onChange={(event) => this.handleInputChange(event, 'quantity')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <input
                            type="text"
                            id="description"
                            value={editedOrder.description}
                            onChange={(event) => this.handleInputChange(event, 'description')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="imageURL">Image URL:</label>
                        <input
                            type="text"
                            id="imageURL"
                            value={editedOrder.imageURL}
                            onChange={(event) => this.handleInputChange(event, 'imageURL')}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status:</label>
                        <input
                            type="text"
                            id="status"
                            value={editedOrder.status}
                            onChange={(event) => this.handleInputChange(event, 'status')}
                        />
                    </div>
                    <button onClick={this.saveOrderChanges}>Save</button>
                </div>
            );
        }

        return (
            <div>
                <h1 id="tableLabel">Customer Orders</h1>
                <p>This component demonstrates fetching data from the server.</p>
                {contents}

                <button onClick={this.deleteOrder} disabled={!this.state.selectedOrder}>
                    Delete Selected Order
                </button>

                {formOrEditOrder}
            </div>
        );
    }

    renderOrdersTable(orders, items, users) {
        const { selectedOrder} = this.state;

        return (
            <div>
                <table className='table table-striped' aria-labelledby="tableLabel">
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>Customer</th>
                            <th>Order Date</th>
                            <th>Item Name</th>
                            <th>Quantity of Item</th>
                            <th>Item Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => {

                            let customer = users.find(user => user.id === order.userId);
                            console.log(users);
                            console.log(orders);
                            let customerName = "";
                            let selectedItem = items.find(item => item.id === order.itemId);
                            let imageUrl = "https://cdn.iconscout.com/icon/free/png-256/free-question-mark-1768084-1502257.png";
                            let name = "";

                            if (selectedItem) {
                                imageUrl = selectedItem.imageURL;
                                name = selectedItem.name;
                                console.log(selectedItem);
                            }
                            if (customer) {
                                customerName = customer.userName;
                            }

                            return (
                                <tr key={order.id}>
                                    <td>
                                        <input
                                            type="radio"
                                            name={`orderRadio_${order.id}`}
                                            onChange={(event) => this.handleRadioChange(event, order)}
                                            checked={selectedOrder && selectedOrder.id === order.id}
                                        />
                                    </td>
                                    <td>{customerName}</td>
                                    <td>{order.orderDate}</td>
                                    <td>{name}</td>
                                    <td>{order.orderNumber}</td>
                                    <td>
                                        <img src={imageUrl} alt={`Image for ${order.itemId}`} style={{ maxWidth: '100px' }}/>
                                    </td>
                                </tr>
                            )})}
                    </tbody>
                </table>
            </div>
        );
    }
}

