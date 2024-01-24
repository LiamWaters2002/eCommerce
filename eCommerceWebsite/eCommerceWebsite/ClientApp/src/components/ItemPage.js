﻿import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CSS/StyleSheet.css';

export default function ItemPage(props) {
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const location = useLocation();


    useEffect(() => {
        if (itemId) {
            fetch(`https://localhost:7195/api/Item/GetItemById?id=${itemId}`)
                .then((res) => res.json())
                .then((itemData) => setItem(itemData))
                .catch((err) => console.error(err));
        } else {
            fetch('https://localhost:7195/api/Item/GetItems')
                .then((res) => res.json())
                .then((itemData) => setItem(itemData))
                .catch((err) => console.error(err));
        }
    }, [itemId]);

    const IndividualItemPage = ({ item, onBuyClick, onQuantityChange }) => (
        <div className="item-details-container">
            {/* Display item name at the top */}
            <h1>{item.name}</h1>

            {/* Display item image below the title */}
            <div className="image-and-description-container">
                <div className="image-container">
                    <img
                        src={item.imageURL}
                        alt={item.name}
                        className="custom-img-size item-image"
                    />
                </div>

                {/* Move item description directly below the image */}
                <div className="item-details">
                    <h2>£{item.unitPrice}</h2>
                    <h3>Seller: {item.manufacturer}</h3>

                    {/* Quantity Selector */}
                    <p>
                        <h2>Quantity:</h2>
                    </p>
                    <input
                        type="number"
                        min="1"
                        defaultValue="1"
                        max={item.quantity}
                        value={item.selectedQuantity}
                        onChange={(e) => onQuantityChange(e.target.value)}
                    />

                    {/* Buy Button */}
                    <button onClick={onBuyClick}>Buy</button>
                </div>
            </div>
            <p className="item-description">{item.description}</p>
        </div>
    );

    const placeOrder = async (orderData) => {
        try {
            const response = await fetch('https://localhost:7195/api/Order/PlaceOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
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



    // Function to render a single item card
    const renderCard = (item) => (
        <div key={item.id} className="col-md-4">
            {location.pathname !== `/example-products/${item.id}` ? (
                // Display a link to the individual item page if not on the individual item page
                <Link to={`/example-products/${item.id}`} className="card-link">
                    <div className="card" style={{ width: '100%' }}>
                        {/* Display item image at the top */}
                        <img
                            src={item.imageURL}
                            alt={item.name}
                            className="card-img-top custom-img-size"
                        />
                        <div className="card-body">
                            {/* Display item details */}
                            <h1 className="card-title">
                                {item.name}  
                            </h1>
                            <h4 >
                               £{item.unitPrice}
                            </h4>
                            Sold By:<br/>{item.manufacturer}
                        </div>
                    </div>
                </Link>
            ) : (
                    // Display individual item page
                    <IndividualItemPage
                        item={item}
                        onBuyClick={(quantity) => {

                            var today = new Date();
                            var date = today.toLocaleDateString();

                            let token = localStorage.getItem('accessToken');
                            let decodedToken = jwtDecode(token);
                            let username = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];


                            const newOrderData = {
                                id: 1,
                                userId: username, //Change from username to userID as username will not always be unique........................................................
                                itemId: item.id,
                                orderNumber: 1,
                                orderDate: date.toString(), 
                                orderStatus: "0",
                            };

                            console.log(newOrderData)

                            placeOrder(newOrderData);
                            
                            console.log(`Item ${quantity} ID ${item.id} bought!`);
                        }}
                    />
            )}
        </div>
    );

    // Render the item page
    return (
        <div className="item-page-container" style={{ width: '100%' }}>
            {item ? (
                // Display items in a responsive grid layout using bootstrap
                <div className="row g-5">
                    {Array.isArray(item) ? (
                        // If item is an array, map through each item and render a card
                        item.map((itemData) => renderCard(itemData))
                    ) : (
                        // If item is not an array, render a single card
                        renderCard(item)
                    )}
                </div>
            ) : (
                // Display a loading message if item data is not available
                <p>Loading...</p>
            )}
        </div>
    );
}
