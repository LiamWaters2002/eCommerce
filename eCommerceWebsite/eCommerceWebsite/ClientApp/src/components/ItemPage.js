// ItemPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ItemPage() {
    // Get the itemId from the URL
    const { itemId } = useParams();

    // Create a state variable to store the item data
    const [item, setItem] = useState(null);

    // Fetch the item data from the template API when the component mounts
    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/posts/${itemId}`)
            .then((res) => res.json())
            .then((data) => setItem(data))
            .catch((err) => console.error(err));
    }, [itemId]);

    // Render the item data or a loading message
    return (
        <div>
            {item ? (
                <div>
                    <h1>{item.title}</h1>
                    <p>{item.body}</p>
                    <img
                        src={`https://picsum.photos/id/${itemId}/200/300`}
                        alt={item.title}
                    />
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default ItemPage;
