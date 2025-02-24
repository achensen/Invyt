import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <Router>
      <Navigation />
      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/create-event" element={<CreateEvent />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
