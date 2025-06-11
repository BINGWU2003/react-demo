import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import { Home, About, Contact, NotFound, Login, ApiExample } from '../pages';
import { UserLayout, Profile, Settings } from '../pages/User';
import { UserList } from '../pages/UserList';
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'contact',
        element: <Contact />
      },
      {
        path: 'api-example',
        element: <ApiExample />
      },
      {
        path: 'user',
        element: (
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'profile',
            element: <Profile />
          },
          {
            path: 'settings',
            element: <Settings />
          }
        ]
      },
      {
        path: 'user-list',
        element: <UserList />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]);
