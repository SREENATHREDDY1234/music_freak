import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();//Gives info about the current URL location. Useful to remember where the user wanted to go before redirecting.

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
    // If user is not authenticated, redirect them to the login page.
    // state={{ from: location }} passes info about where they were trying to go.
    // replace prevents adding a new entry to the browser history stack.
  }

  return children;
  //If authenticated, simply render the protected content (children).
};

export default RequireAuth;