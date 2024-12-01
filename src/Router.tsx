import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App';
import { Login } from './pages/Login';
import { SignupFlow } from './pages/SignupFlow';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignupFlow />,
  },
  {
    path: '/:username/:spaceTitle?',
    element: <App />,
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
