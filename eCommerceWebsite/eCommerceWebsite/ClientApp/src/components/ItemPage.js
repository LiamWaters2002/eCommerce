import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ItemPage(props) {
    // Get the itemId from the URL
    const { itemId } = useParams();

    // Create a state variable to store the item or items data
    const [data, setData] = useState(null);

    // Fetch the item or items data from the API when the component mounts
    useEffect(() => {
        // Check if the itemId exists or not
        if (itemId) {
            // Fetch the item data using the itemId
            fetch(`https://jsonplaceholder.typicode.com/posts/${itemId}`)
                .then((res) => res.json())
                .then((data) => setData(data))
                .catch((err) => console.error(err));
        } else {
            // Fetch all the items data
            fetch('https://jsonplaceholder.typicode.com/posts')
                .then((res) => res.json())
                .then((data) => setData(data))
                .catch((err) => console.error(err));
        }
    }, [itemId]);

    // Render the item or items data or a loading message
    return (
        <div>
            {data ? (
                <div>
                    {Array.isArray(data) ? (
                        // Render the array of items
                        data.map((item) => (
                            <div key={item.id} className="post">
                                <h3>
                                    {item.title} - {item.id}
                                </h3>
                                <p>{item.body}</p>
                                <img
                                    src={`https://picsum.photos/id/${item.id}/200/300`}
                                    alt={item.title}
                                />
                            </div>
                        ))
                    ) : (
                        // Render the single item
                        <div className="post">
                            <h3>
                                {data.title} - {data.id}
                            </h3>
                            <p>{data.body}</p>
                            <img
                                src={`https://picsum.photos/id/${data.id}/200/300`}
                                alt={data.title}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
