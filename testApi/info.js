const { Client } = require('@elastic/elasticsearch');

// Khởi tạo Elasticsearch client
const elasticClient = new Client({ node: 'http://localhost:9200/' });

async function testConnection() {
  try {
    // Kiểm tra thông tin cluster
    const info = await elasticClient.info();
    console.log('Connected to Elasticsearch!');
    console.log('Cluster Info:', info);
  } catch (error) {
    console.error('Error connecting to Elasticsearch:', error.message);
  }
}

// Gọi hàm test
testConnection();
