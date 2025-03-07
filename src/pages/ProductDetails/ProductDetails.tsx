import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Input, Select, Tag, Space, Typography, Rate, Image, Badge } from 'antd';
import { SearchOutlined, FilterOutlined, SwapOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useProducts } from '../../hooks/useProducts';
import { Product } from '../../types/products';
import styles from './ProductDetails.module.scss';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const ProductDetails: React.FC = () => {
  const { products, loading } = useProducts();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [brandFilter, setBrandFilter] = useState<string[]>([]);
  const navigate = useNavigate();

useEffect(()=>{
if(localStorage.getItem('compareProducts')){
const products = JSON.parse(localStorage.getItem('compareProducts') || '[]');
if(products.length > 0){
setSelectedProducts(products || []);
}
}
}, [])

  const handleCompare = (product: Product) => {
    if (selectedProducts.length < 4 && !selectedProducts.some(p => p.id === product.id)) {
      const newSelected = [...selectedProducts, product];
      setSelectedProducts(newSelected);
      localStorage.setItem('compareProducts', JSON.stringify(newSelected || '[]'));

      // User can be able to compare 4 products only
      if (newSelected.length >= 4) {
        navigate('/compare');
      }
    }
  };

  const handleViewCompare = () => {
    navigate('/compare');
  };

  // Get unique brands for filter
  const uniqueBrands = [...new Set(products.map(product => product.brand))];

  // Filter products based on search and brand filter
  const filteredProducts = products.filter(product => {
    const matchesSearch = product?.title?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
                         product?.description?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
                         product?.brand?.toLowerCase()?.includes(searchText?.toLowerCase());
    
    const matchesBrand = brandFilter.length === 0 || brandFilter.includes(product.brand);
    
    return matchesSearch && matchesBrand;
  });

  const columns: ColumnsType<Product> = [
    { 
      title: 'Product', 
      key: 'product',
      render: (_, record) => (
        <Space className={styles.productCell}>
          <div className={styles.imageContainer}>
            <Image 
              src={record.thumbnail || "/api/placeholder/80/80"} 
              alt={record.title}
              width={60}
              height={60}
              className={styles.productImage}
              fallback="/api/placeholder/80/80"
              preview={false}
            />
          </div>
          <Space direction="vertical" size={0} className={styles.productInfo}>
            <span className={styles.productTitle}>{record.title}</span>
            <span className={styles.productCategory}>{record.category}</span>
            {record.stock && record.stock < 10 && (
              <Badge count={`Low Stock: ${record.stock}`} className={styles.stockBadge} />
            )}
          </Space>
        </Space>
      ),
      width: '30%',
      sorter: (a, b) => a.title.localeCompare(b.title)
    },
    { 
      title: 'Price', 
      dataIndex: 'price', 
      key: 'price',
      render: (price, record) => (
        <Space direction="vertical" size={0}>
          <span className={styles.productPrice}>${price}</span>
          {record.discountPercentage && (
            <span className={styles.discountTag}>
              {record.discountPercentage}% off
            </span>
          )}
        </Space>
      ),
      width: '15%',
      sorter: (a, b) => a.price - b.price
    },
    { 
      title: 'Brand', 
      dataIndex: 'brand', 
      key: 'brand',
      render: (brand) => <Tag color="blue">{brand}</Tag>,
      width: '15%',
      sorter: (a, b) => a.brand.localeCompare(b.brand)
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <Space>
          <Rate disabled defaultValue={rating} allowHalf character={<span>★</span>} />
          <span>{rating}</span>
        </Space>
      ),
      width: '20%',
      sorter: (a, b) => a.rating - b.rating
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            disabled={selectedProducts.some(p => p.id === record.id)}
            onClick={() => handleCompare(record)}
            icon={<SwapOutlined />}
            size="small"
          >
            Compare
          </Button>
        </Space>
      ),
      width: '20%'
    },
  ];

  return (
    <div className={styles.productDetails}>
      <Card className={styles.filterCard}>
        <div className={styles.filterHeader}>
          <Title level={4}><FilterOutlined /> Product Filters</Title>
          {selectedProducts.length > 0 && (
            <Button 
              type="primary" 
              onClick={handleViewCompare}
              icon={<SwapOutlined />}
            >
              View Comparison ({selectedProducts.length})
            </Button>
          )}
        </div>
        
        <div className={styles.filterControls}>
          <Input 
            placeholder="Search products" 
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            className={styles.searchInput}
          />
          <Select
            mode="multiple"
            allowClear
            placeholder="Filter by brand"
            style={{ width: '100%' }}
            onChange={(value) => setBrandFilter(value)}
            className={styles.brandFilter}
          >
            {uniqueBrands.map(brand => (
              <Option key={brand} value={brand}>{brand}</Option>
            ))}
          </Select>
        </div>
      </Card>
      
      <Table
        columns={columns}
        style={{width: "100%"}}
        dataSource={filteredProducts}
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} products` }}
        rowKey="id"
        className={styles.productTable}
      />
    </div>
  );
};

export default ProductDetails;