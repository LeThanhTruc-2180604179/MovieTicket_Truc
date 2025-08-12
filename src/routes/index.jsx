import HomeTemplate from "../pages/HomeTemplate";
import HomePage from "../pages/HomeTemplate/HomePage";
import AboutPage from "../pages/HomeTemplate/AboutPage";
import ListMoviePage from "../pages/HomeTemplate/ListMoviePage";
import NewsPage from "../pages/HomeTemplate/NewsPage";
import AuthSwitcher from "../pages/HomeTemplate/AuthSwitcher";
import EditProfilePage from "../pages/HomeTemplate/EditProfilePage";
import MyTicketsPage from "../pages/HomeTemplate/MyTicketsPage";
import MovieDetailPage from "../pages/HomeTemplate/ListMoviePage/MovieDetailPage";
import BookingPage from "../pages/HomeTemplate/BookingPage";

import AdminTemplate from "../pages/AdminTemplate";
import Dashboard from "../pages/AdminTemplate/Dashboard";
import AddUserPage from "../pages/AdminTemplate/AddUserPage";
import AuthPage from "../pages/AdminTemplate/AuthPage";
import { Route } from "react-router-dom";
import AdminOnlyRoute from "./AdminOnlyRoute";

const routes = [
  {
    path: "",
    element: AdminOnlyRoute,
    nested: [
      {
        path: "",
        element: HomePage,
      },
      {
        path: "about",
        element: AboutPage,
      },
      {
        path: "list-movie",
        element: ListMoviePage,
      },
      {
        path: "news",
        element: NewsPage,
      },
      {
        path: "login",
        element: AuthSwitcher,
      },
      {
        path: "register",
        element: AuthSwitcher,
      },
      {
        path: "edit-profile",
        element: EditProfilePage,
      },
      {
        path: "my-tickets",
        element: MyTicketsPage,
      },
      {
        path: "movie/:maPhim",
        element: MovieDetailPage,
      },
      {
        path: "booking/:maLichChieu",
        element: BookingPage,
      },
    ],
  },
  {
    path: "admin",
    element: AdminTemplate,
    nested: [
      {
        path: "dashboard",
        element: Dashboard,
      },
      {
        path: "add-user",
        element: AddUserPage,
      },
    ],
  },
  {
    path: "auth",
    element: AuthPage,
  },
];

export const generateRoutes = () => {
  return routes.map((route) => {
    if (route.nested) {
      return (
        <Route key={route.path} path={route.path} element={<route.element>{<HomeTemplate />}</route.element>}>
          {route.nested.map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={<item.element />}
            />
          ))}
        </Route>
      );
    } else {
      return (
        <Route key={route.path} path={route.path} element={<route.element />} />
      );
    }
  });
};
