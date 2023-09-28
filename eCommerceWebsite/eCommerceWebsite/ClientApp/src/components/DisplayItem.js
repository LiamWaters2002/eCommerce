import React, { Component } from 'react';

export class DisplayItem extends Component {
    static displayName = DisplayItem.name;

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            items: [], 
            selectedItem: null,
            editedItem: null, // Store the currently edited item
        };
    }


    //Run when the component is mounted onto dom.
    componentDidMount() {
        this.fetchItems();
    }

    async fetchItems() {
        try {
            const response = await fetch('https://localhost:7195/api/Item/GetItem'); // Replace with your API URL
            if (response.ok) {
                const data = await response.json();
                this.setState({ items: data, loading: false });
            } else {
                // Handle error here
                console.error('Failed to fetch items.');
            }
        } catch (error) {
            console.error('An error occurred while fetching items:', error);
        }
    }

    async addItem(itemData) {
        try {
            const response = await fetch('https://localhost:7195/api/Item/AddItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData),
            });

            if (response.ok) {
                // Item added successfully, you can handle this as needed
                // You may want to refresh the item list after adding
                this.fetchItems();
            } else {
                // Handle error here
                console.error('Failed to add item.');
            }
        } catch (error) {
            console.error('An error occurred while adding the item:', error);
        }
    }

    async updateItem(itemId, updatedItemData) {
        try {
            const response = await fetch(`https://localhost:7195/api/Item/UpdateItem/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItemData),
            });

            if (response.ok) {
                // Item updated successfully, you can handle this as needed
                // You may want to refresh the item list after updating
                this.fetchItems();
            } else {
                // Handle error here
                console.error('Failed to update item.');
            }
        } catch (error) {
            console.error('An error occurred while updating the item:', error);
        }
    }

    async deleteItem(itemId) {
        try {
            const response = await fetch(`https://localhost:7195/api/Item/DeleteItem/${itemId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Item deleted successfully, you can handle this as needed
                // You may want to refresh the item list after deleting
                this.fetchItems();
            } else {
                // Handle error here
                console.error('Failed to delete item.');
            }
        } catch (error) {
            console.error('An error occurred while deleting the item:', error);
        }
    }

    handleRadioChange = (event, selectedItem) => {
        this.setState({ selectedItem });
        console.log(this.state.selectedItem)
    }


    editItem(item) {
        this.setState({ editedItem: item });
    }

    render() {
        let contents;

        if (this.state.loading) {
            contents = <p><em>Loading...</em></p>;
        } else {
            contents = DisplayItem.renderItemsTable(this.state.items, this.handleRadioChange, this.state.selectedItem);
        }

        return (
            <div>
                <h1 id="tableLabel">Items</h1>
                <p>This component demonstrates fetching data from the server.</p>
                {contents}
            </div>
        );
    }

    static renderItemsTable(items, handleRadioChange, selectedItem) {
        return (
            <table className='table table-striped' aria-labelledby="tableLabel">
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Manufacturer</th>
                        <th>Unit Price</th>
                        <th>Discount</th>
                        <th>Quantity</th>
                        <th>Description</th>
                        <th>Image URL</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    { /* Create new row and add item attributes to each individual cell */}
                    {items.map(item =>
                        <tr key={item.id}>
                            <td>
                                <input
                                    type="radio"
                                    name="itemRadio"
                                    onChange={(event) => handleRadioChange(event, item)}
                                    checked={selectedItem && selectedItem.id === item.id} 
                                />
                            </td>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.manufacturer}</td>
                            <td>{item.unitPrice}</td>
                            <td>{item.discount}</td>
                            <td>{item.quantity}</td>
                            <td>{item.description}</td>
                            <td>{item.imageURL}</td>
                            <td>{item.status}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
}