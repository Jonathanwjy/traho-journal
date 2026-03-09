import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "./index.css";
import Login from "./auth/login";
import RegisterPage from "./auth/register";
import ProtectedRoute from "./ProtectedRoute";
import ProfilePage from "./profile/ProfilePage";
import Layout from "./Layout";
import Dashboard from "./Dashboard";
import AddStock from "./stocks/add_stock";
import EditStock from "./stocks/edit_stock";
import StockDetail from "./stocks/stock_detail";
import StatIndex from "./stats/stat_index";
import StatDetail from "./stats/stat_detail";
import Welcome from "./welcome/welcome";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          {" "}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/stocks">
              <Route path="store" element={<AddStock />}></Route>
              <Route path=":id/update" element={<EditStock />}></Route>
              <Route path=":id/detail" element={<StockDetail />} />
            </Route>

            <Route path="/stats">
              <Route index element={<StatIndex />}></Route>
              <Route path="detail/:id" element={<StatDetail />}></Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
