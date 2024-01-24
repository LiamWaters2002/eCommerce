import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import { DisplayItem } from "./components/DisplayItem";
import { DisplayUser } from "./components/DisplayUser";
import { DisplayOrder } from "./components/DisplayOrder";
import { DisplayCart } from "./components/DisplayCart";
import ItemPage from "./components/ItemPage";

const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/counter',
        element: <Counter />
    },
    {
        path: '/fetch-data',
        element: <FetchData />
    },
    {
        path: '/products/',
        element: <DisplayItem />
    },
    {
        path: '/products/:itemId',
        element: <DisplayItem />
    },
    {
        path: '/example-products/',
        element: <ItemPage />
    },
    {
        path: '/example-products/:itemId',
        element: <ItemPage />
    },
    {
        path: '/display-order',
        element: <DisplayOrder />
    },
    {
        path: '/display-cart',
        element: <DisplayCart />
    },
    {
        path: '/display-users',
        element: <DisplayUser />
    }
];

export default AppRoutes;