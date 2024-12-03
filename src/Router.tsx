import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App';
import { Login } from './pages/Login';
import { SignupFlow } from './pages/SignupFlow/index';
import { SignupGuard } from './components/Guards/SignupGuard';
import { VisualSpace } from './pages/VisualSpace';

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
    path: '/space/:id',
    element: (
      <SignupGuard>
        <VisualSpace />
      </SignupGuard>
    ),
  },
  {
    path: '/:username',
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
