import { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import AddNewDoctor from "./components/AddNewDoctor";
import Messages from "./components/Messages";
import Doctors from "./components/Doctors";
import { Context } from "./context";
import { api } from "./api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import AddNewAdmin from "./components/AddNewAdmin";
import "./App.css";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setAdmin } =
    useContext(Context);
  // Until the session check finishes we don't know whether the admin is
  // logged in. Previously every protected page redirected to /login on a
  // page refresh before /admin/me had answered.
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchUser = async () => {
      try {
        const response = await api.get("/user/admin/me");
        if (cancelled) return;
        setIsAuthenticated(true);
        setAdmin(response.data.user);
      } catch {
        if (cancelled) return;
        setIsAuthenticated(false);
        setAdmin({});
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    };
    fetchUser();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, setAdmin, setIsAuthenticated]);

  if (checkingSession) {
    return (
      <section className="page" style={{ justifyContent: "center", alignItems: "center" }}>
        <h1>Loading...</h1>
      </section>
    );
  }

  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctor/addnew" element={<AddNewDoctor />} />
        <Route path="/admin/addnew" element={<AddNewAdmin />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
