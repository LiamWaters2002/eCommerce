import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
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
                .then((itemData) => setItem(itemData)) //set the item here...
                .catch((err) => console.error(err));
        } else {
            fetch('https://localhost:7195/api/Item/GetItems')
                .then((res) => res.json())
                .then((itemData) => setItem(itemData)) //set the items here...
                .catch((err) => console.error(err));
        }
    }, [itemId]);

    // Function to render a single item card
    const renderCard = (item) => (
        <div key={item.id} className="col-6">
            {location.pathname !== `/example-products/${item.id}` ? (
                // Display a link to the individual item page if not on the individual item page
                <Link to={`/example-products/${item.id}`} className="card-link">
                    <div className="card" style={{ width: '100%' }}>
                        {/* Display item image at the top */}
                        <img
                            src={item.imageURL}
                            alt={item.name}
                            className="card-img-top"
                        />
                        <div className="card-body">
                            {/* Display item details */}
                            <h3 className="card-title">
                                Name: {item.name} - ID: {item.id} - £{item.unitPrice} - Total Quantity: {item.quantity} - Manufacturer: {item.manufacturer}
                            </h3>
                            <p className="card-text">{item.description}</p>
                        </div>
                    </div>
                </Link>
            ) : (
                // Display item details without a link if on the individual item page
                <div className="card" style={{ width: '100%' }}>
                    {/* Display item image at the top */}
                    <img
                        src={item.imageURL}
                        alt={item.name}
                        className="card-img-top"
                    />
                    <div className="card-body">
                        <h3 className="card-title">
                            Name: {item.name} - ID: {item.id} - £{item.unitPrice} - Total Quantity: {item.quantity} - Manufacturer: {item.manufacturer}
                        </h3>
                        <p className="card-text">{item.description}</p>
                    </div>
                </div>
            )}
        </div>
    );



    // Render the item page
    return (
        <div className="item-page-container" style={{ width: '1280px' }}>
            {item ? (
                // Display items in a responsive grid layout using bootstrap
                <div className="row row-cols-2 row-cols-md-3 g-5">
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
