import { Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./components/Auth/Login";

const setRoutes = (user, loading) => {
  if (user)
    return [
      {
        path: "/",
        element: <Layout user={user} loading={loading} />,
        children: [
          { path: "/home", element: <Home user={user} /> },
          { path: "/", element: <Navigate to="/home" replace /> },
          { path: "*", element: <Navigate to="/home" replace /> },
        ],
      },
    ];

  return [
    {
      path: "/",
      element: <Layout user={user} loading={loading} />,
      children: [
        { path: "/", element: <Login /> },
        { path: "*", element: <Login /> },
      ],
    },
  ];
};

export default setRoutes;
