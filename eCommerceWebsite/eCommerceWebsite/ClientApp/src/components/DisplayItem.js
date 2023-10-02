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
                method: 'PATCH',
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

    deleteItem = async () => {

        const { selectedItem } = this.state;

        if (!selectedItem) {
            console.error('No item selected for deletion.');
            return;
        }
        try {
            const response = await fetch(`https://localhost:7195/api/Item/DeleteItem/${selectedItem.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Item deleted successfully, you can handle this as needed
                // You may want to refresh the item list after deleting
                this.fetchItems();
                this.setState({ selectedItem: null });
            } else {
                // Handle error here
                console.error('Failed to delete item.');
            }
        } catch (error) {
            console.error('An error occurred while deleting the item:', error);
        }
    }

    handleRadioChange = (event, selectedItem) => {
        this.setState((prevState) => {
            // If the same radio button is clicked again, deselect it
            if (prevState.selectedItem === selectedItem) {
                console.log('Deselecting radio button');
                return { selectedItem: null, editedItem: null };
            }
            console.log('Selecting radio button');
            return { selectedItem, editedItem: selectedItem };
        });
    };

    handleInputChange = (event, field) => {
        const { editedItem } = this.state;
        const updatedItem = { ...editedItem, [field]: event.target.value };
        this.setState({ editedItem: updatedItem });
    };

    toggleEdit = () => {
        const { selectedItem } = this.state;
        if (selectedItem) {
            this.setState({ editedItem: selectedItem });
        }
    };

    saveItemChanges = () => {
        const { editedItem } = this.state;
        this.updateItem(editedItem.id, editedItem);
        this.setState({ editedItem: null });
    };


    //editItem(item) {
    //    this.setState({ editedItem: item });
    //}

    render() {
        let contents;

        if (this.state.loading) {
            contents = <p><em>Loading...</em></p>;
        } else {
            contents = this.renderItemsTable(this.state.items);
        }

        return (
            <div>
                <h1 id="tableLabel">Items</h1>
                <p>This component demonstrates fetching data from the server.</p>
                {contents}
                <button onClick={this.toggleEdit} disabled={!this.state.selectedItem}>
                    Edit Selected Item
                </button>
                <button onClick={this.deleteItem} disabled={!this.state.selectedItem}>
                    Delete Selected Item
                </button>
            </div>
        );
    }

    renderItemsTable(items) {
        const { selectedItem, editedItem } = this.state;

        return (
            <div>
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
                        {items.map(item =>
                            <tr key={item.id}>
                                <td>
                                    <input
                                        type="radio"
                                        name={`itemRadio_${item.id}`}
                                        onChange={(event) => this.handleRadioChange(event, item)}
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
                {editedItem && (
                    <div>
                        <h2>Edit Item</h2>
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                value={editedItem.name}
                                onChange={(event) => this.handleInputChange(event, 'name')}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="manufacturer">Manufacturer:</label>
                            <input
                                type="text"
                                id="manufacturer"
                                value={editedItem.manufacturer}
                                onChange={(event) => this.handleInputChange(event, 'manufacturer')}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="unitPrice">Unit Price:</label>
                            <input
                                type="text"
                                id="unitPrice"
                                value={editedItem.unitPrice}
                                onChange={(event) => this.handleInputChange(event, 'unitPrice')}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="discount">Discount:</label>
                            <input
                                type="text"
                                id="discount"
                                value={editedItem.discount}
                                onChange={(event) => this.handleInputChange(event, 'discount')}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="quantity">Quantity:</label>
                            <input
                                type="text"
                                id="quantity"
                                value={editedItem.quantity}
                                onChange={(event) => this.handleInputChange(event, 'quantity')}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <input
                                type="text"
                                id="description"
                                value={editedItem.description}
                                onChange={(event) => this.handleInputChange(event, 'description')}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="imageURL">Image URL:</label>
                            <input
                                type="text"
                                id="imageURL"
                                value={editedItem.imageURL}
                                onChange={(event) => this.handleInputChange(event, 'imageURL')}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Status:</label>
                            <input
                                type="text"
                                id="status"
                                value={editedItem.status}
                                onChange={(event) => this.handleInputChange(event, 'status')}
                            />
                        </div>
                        <button onClick={this.saveItemChanges}>Save</button>
                    </div>

                )}
            </div>
        );
    }
}