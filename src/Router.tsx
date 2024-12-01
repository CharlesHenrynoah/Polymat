import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App';
import { Login } from './pages/Login';
import { SignupFlow } from './pages/SignupFlow/index';
import { SignupGuard } from './components/Guards/SignupGuard';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup/level1',
    element: <SignupFlow />,
  },
  {
    path: '/signup/level2',
    element: <SignupFlow startAtLevel2={true} />,
  },
  {
    path: '/signup',
    element: <SignupFlow />,
  },
  {
    path: '/:username/:spaceTitle?',
    element: (
      <SignupGuard>
        <App />
      </SignupGuard>
    ),
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
