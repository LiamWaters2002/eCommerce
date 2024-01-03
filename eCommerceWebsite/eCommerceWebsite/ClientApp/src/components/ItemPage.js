import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CSS/StyleSheet.css';

export default function ItemPage(props) {
    const { itemId } = useParams();
    const [data, setData] = useState(null);
    const location = useLocation();

    useEffect(() => {
        if (itemId) {
            fetch(`https://localhost:7195/api/Item/GetItemById?id=${itemId}`)
                .then((res) => res.json())
                .then((data) => setData(data))
                .catch((err) => console.error(err));
        } else {
            fetch('https://localhost:7195/api/Item/GetItems')
                .then((res) => res.json())
                .then((data) => setData(data))
                .catch((err) => console.error(err));
        }
    }, [itemId]);

    return (
        <div className="item-page-container">
            {data ? (
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {Array.isArray(data) ? (
                        data.map((item) => (
                            <div key={item.id} className="col">
                                {location.pathname !== `/example-products/${item.id}` ? (
                                    <Link to={`/example-products/${item.id}`} className="card-link">
                                        <div className="card">
                                            <div className="card-body">
                                                <h3 className="card-title">
                                                    Name: {item.name} - ID: {item.id} - £{item.unitPrice} - Total Quantity: {item.quantity} - Manufacturer: {item.manufacturer}
                                                </h3>
                                                <p className="card-text">{item.description}</p>
                                                <img
                                                    src={item.imageURL}
                                                    alt={item.title}
                                                    className="card-img-top"
                                                />
                                            </div>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="card">
                                        <div className="card-body">
                                            <h3 className="card-title">
                                                Name: {item.name} - ID: {item.id} - £{item.unitPrice} - Total Quantity: {item.quantity} - Manufacturer: {item.manufacturer}
                                            </h3>
                                            <p className="card-text">{item.description}</p>
                                            <img
                                                src={item.imageURL}
                                                alt={item.title}
                                                className="card-img-top"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col">
                            {location.pathname !== `/example-products/${data.id}` ? (
                                <Link to={`/example-products/${data.id}`} className="card-link">
                                    <div className="card">
                                        <div className="card-body">
                                            <h3 className="card-title">
                                                {data.title} - {data.id}
                                            </h3>
                                            <p className="card-text">{data.body}</p>
                                            <img
                                                src={data.imageURL}
                                                alt={data.title}
                                                className="card-img-top"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <div className="card">
                                    <div className="card-body">
                                        <h3 className="card-title">
                                            {data.title} - {data.id}
                                        </h3>
                                        <p className="card-text">{data.body}</p>
                                        <img
                                            src={data.imageURL}
                                            alt={data.title}
                                            className="card-img-top"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
