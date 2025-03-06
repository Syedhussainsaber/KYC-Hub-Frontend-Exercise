import axios from 'axios';
import { ProductsResponse } from '../types/products';

const API_URL = 'https://dummyjson.com/products';

export const fetchProducts = async (): Promise<ProductsResponse> => {
  const response = await axios.get<ProductsResponse>(API_URL);
  return response.data;
};