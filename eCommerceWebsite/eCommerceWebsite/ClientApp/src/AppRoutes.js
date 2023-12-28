import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import { DisplayItem } from "./components/DisplayItem";
import { DisplayUser } from "./components/DisplayUser";

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
        path: '/products',
        element: <DisplayItem />
    },
    {
        path: '/display-users',
        element: <DisplayUser />
    }
];

export default AppRoutes;