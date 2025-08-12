import { BrowserRouter, Routes, Route } from "react-router-dom";
// import HomeTemplate from "./pages/HomeTemplate";
// import HomePage from "./pages/HomeTemplate/HomePage";
// import AboutPage from "./pages/HomeTemplate/AboutPage";
// import ListMoviePage from "./pages/HomeTemplate/ListMoviePage";
// import AdminTemplate from "./pages/AdminTemplate";
// import Dashboard from "./pages/AdminTemplate/Dashboard";
// import AddUserPage from "./pages/AdminTemplate/AddUserPage";
import { generateRoutes } from "./routes";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {generateRoutes()}
        {/* Home Template - localhost:5173 */}
        {/* <Route path="" element={<HomeTemplate />}>
          <Route path="" element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="list-movie" element={<ListMoviePage />} />
        </Route> */}

        {/* Admin Template */}
        {/* <Route path="admin" element={<AdminTemplate />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-user" element={<AddUserPage />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
