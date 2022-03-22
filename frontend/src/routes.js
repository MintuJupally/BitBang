import { Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";

const setRoutes = () => {
  return [
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/home", element: <Home /> },
        { path: "/", element: <Navigate to="/home" replace /> },
        { path: "*", element: <Navigate to="/home" replace /> },
      ],
    },
  ];
};

export default setRoutes;
