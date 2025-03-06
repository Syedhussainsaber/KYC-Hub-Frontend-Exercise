import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import CompareProducts from './pages/CompareProducts/CompareProducts';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <ProductDetails /> },
      { path: 'compare', element: <CompareProducts /> },
    ],
  },
]);