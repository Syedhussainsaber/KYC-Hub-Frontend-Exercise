import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Card, Empty, Tag, Space, Typography, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, SwapOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useProducts } from '../../hooks/useProducts';
import { Product } from '../../types/products';
import styles from './CompareProducts.module.scss';

const { Title } = Typography;

const CompareProducts: React.FC = () => {
  const { products, loading } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

useEffect(()=>{
if(localStorage.getItem('compareProducts')){
const products = JSON.parse(localStorage.getItem('compareProducts') || '[]');
if(products.length > 0){
setSelectedProducts(products || []);
}
}
}, [])

  const handleAddMore = () => {
    setIsModalOpen(true);
  };

  const handleRemove = (product: Product) => {
    const filteredProducts = selectedProducts.filter((p) => p.id !== product.id)
    setSelectedProducts(filteredProducts);
    localStorage.setItem('compareProducts', JSON.stringify(filteredProducts || '[]'));
  };

  const handleAddToCompare = (product: Product) => {
    if (selectedProducts.length < 4 && !selectedProducts.some(p => p.id === product.id)) {
      const products = [...selectedProducts, product];
      setSelectedProducts(products);
      localStorage.setItem('compareProducts', JSON.stringify( products || '[]'));
      setIsModalOpen(false);
    }
  };

  const compareColumns: ColumnsType<Product> = [
    { 
      title: 'Title', 
      dataIndex: 'title', 
      key: 'title',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <span className={styles.productTitle}>{text}</span>
          <span className={styles.productCategory}>{record.category}</span>
        </Space>
      ),
      width: '30%'
    },
    { 
      title: 'Price', 
      dataIndex: 'price', 
      key: 'price',
      render: (price) => <span className={styles.productPrice}>${price}</span>,
      width: '15%'
    },
    { 
      title: 'Brand', 
      dataIndex: 'brand', 
      key: 'brand',
      render: (brand) => <Tag color="blue">{brand}</Tag>,
      width: '15%'
    },
    { 
      title: 'Rating', 
      dataIndex: 'rating', 
      key: 'rating',
      render: (rating) => (
        <div className={styles.ratingContainer}>
          <span className={styles.ratingValue}>{rating}</span>
          <span className={styles.ratingMax}>/5</span>
        </div>
      ),
      width: '15%'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemove(record)}
          className={styles.removeButton}
        >
          Remove
        </Button>
      ),
      width: '15%'
    },
  ];

  const modalColumns: ColumnsType<Product> = [
    { 
      title: 'Title', 
      dataIndex: 'title', 
      key: 'title',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <span>{text}</span>
          <span className={styles.productCategory}>{record.category}</span>
        </Space>
      ),
      ellipsis: true
    },
    { 
      title: 'Price', 
      dataIndex: 'price', 
      key: 'price',
      render: (price) => <span>${price}</span>,
      sorter: (a, b) => a.price - b.price,
      width: '15%'
    },
    { 
      title: 'Brand', 
      dataIndex: 'brand', 
      key: 'brand',
      render: (brand) => <Tag color="blue">{brand}</Tag>,
      width: '15%'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          disabled={selectedProducts.some(p => p.id === record.id)}
          onClick={() => handleAddToCompare(record)}
          icon={<PlusOutlined />}
          size="small"
        >
          Add
        </Button>
      ),
      width: '15%'
    },
  ];

  return (
    <div className={styles.compareProducts}>
      <Card className={styles.compareHeader}>
        <div className={styles.titleSection}>
          <Title level={4}>
            <SwapOutlined /> Product Comparison
            <Tooltip title="Compare up to 4 products side by side">
              <InfoCircleOutlined className={styles.infoIcon} />
            </Tooltip>
          </Title>
          <span className={styles.subtitle}>
            {(selectedProducts.length > 0) 
              ? `Comparing ${selectedProducts.length} ${selectedProducts.length === 1 ? 'product' : 'products'}`
              : 'No products selected for comparison'}
          </span>
        </div>
        <Button 
          type="primary" 
          onClick={handleAddMore} 
          icon={<PlusOutlined />}
          disabled={selectedProducts.length >= 4}
        >
          Add Products
        </Button>
      </Card>

      {selectedProducts.length > 0 ? (
        <Table 
          columns={compareColumns} 
          dataSource={selectedProducts} 
          rowKey="id"
          pagination={false}
          className={styles.compareTable}
          bordered
        />
      ) : (
        <Empty 
          description="No products selected for comparison" 
          className={styles.emptyState}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}

      <Modal
        title="Add Products to Compare"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
        className={styles.productsModal}
      >
        <div className={styles.modalInfo}>
          <span>
            {selectedProducts.length < 4 
              ? `You can add ${4 - selectedProducts.length} more ${4 - selectedProducts.length === 1 ? 'product' : 'products'}`
              : 'Maximum number of products selected'}
          </span>
        </div>
        <Table
          columns={modalColumns}
          dataSource={products}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          loading={loading}
          className={styles.modalTable}
        />
      </Modal>
    </div>
  );
};

export default CompareProducts;