import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ProtectedRoute from "./utils/ProtectedRoute";
import RedirectIfLoggedIn from "./utils/RedirectIfLoggedIn";

function App() {
  return (
    <div className="app-container">
      <Navigation />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/profile" element={<Profile />} />
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/create-event" element={<CreateEvent />} />
          </Route>
          {/* Redirect Logged-in Users Away */}
          <Route element={<RedirectIfLoggedIn />}>
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;