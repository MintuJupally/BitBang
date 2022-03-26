import { Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./components/Auth/Login";
import Admin from "./components/Admin";
import Portfolio from "./components/Portfolio";

const setRoutes = (user, loading) => {
  if (user)
    return [
      {
        path: "/",
        element: <Layout user={user} loading={loading} />,
        children: [
          { path: "/home", element: <Home user={user} /> },
          {
            path: "/portfolio",
            element: user.isRegistered ? (
              <Portfolio user={user} />
            ) : (
              <Navigate to="/home" replace />
            ),
          },
          {
            path: "/admin",
            element: user.admin ? (
              <Admin user={user} />
            ) : (
              <Navigate to="/home" replace />
            ),
          },
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
