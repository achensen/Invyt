import { useContext } from "react";
import { UserContext } from "../context/UserContext";
// import Places from "../components/Places";

const Home = () => {
  const userContext = useContext(UserContext);

  if (!userContext) return null;

  const { user } = userContext;

  // Show this message if no user is logged in
  if (!user) {
    return <h2 className="text-center mt-4">Log in with Google to send an Invyt!</h2>;
  }

 // if (!user) {
  //   return <Places/>;
  // }

  return (
    <div className="container mt-4">
      <h1>Welcome to Invyt</h1>
      <p className="text-center">Create, share, and manage your events seamlessly.</p>
    </div>
  );

};

export default Home;