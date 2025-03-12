import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Events from "../components/Events";
// import Places from "../components/Places";

const Home = () => {
  const userContext = useContext(UserContext);

  if (!userContext) return null;

  const { user } = userContext;

  // Show this message if no user is logged in
  if (!user) {
    return <h2 className="text-center mt-4"
    style={{ backgroundColor: "rgba(107, 129, 255, 0.03) ",  padding: "10px", borderRadius: "5px", color: "#ffffff",display: "inline-block" }}
    >Log in with Google to send an Invyt!</h2>;
    
  }

 // if (!user) {
  //   return <Places/>;
  // }

  return (
    <div className="container mt-4">
      <h1>Welcome to Invyt</h1>
      <p className="text-center">Create, share, and manage your events seamlessly.</p>

      {/* Display local events */}
      <Events />
    </div>
  );
};

export default Home;