import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import { DisplayItem } from "./components/DisplayItem";
import { DisplayUser } from "./components/DisplayUser";
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
        element: <ItemPage />
    },
    {
        path: '/products/:itemId',
        element: <ItemPage />
    },
    {
        path: '/display-users',
        element: <DisplayUser />
    }
];

export default AppRoutes;