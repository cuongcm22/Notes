const dotenv = require('dotenv');
dotenv.config();

// elasticsearch.module.js
const { Client } = require('@elastic/elasticsearch');

// Kết nối tới Elasticsearch
const elasticClient = new Client({ node: 'http://localhost:9200' });

// Hàm tìm kiếm trên Elasticsearch
async function searchInElasticsearch(index, field, value) {
  try {
    const result = await elasticClient.search({
      index, // Tên index
      body: {
        query: {
          match: {
            [field]: value, // Field cần tìm kiếm
          },
        },
      },
    });

    return result.hits.hits.map(hit => hit._source); // Trả về danh sách kết quả
  } catch (error) {
    console.error('Error searching in Elasticsearch:', error);
    throw error;
  }
}

// Hàm tạo index từ MongoDB
async function indexNotesToElasticsearch(notes) {
  try {
    for (const note of notes) {
      await elasticClient.index({
        index: 'notes', // Tên index
        id: note.noteID,
        body: {
          title: note.title,
          title1: note.title1,
          title2: note.title2,
          title3: note.title3,
          desc: note.desc,
          desc1: note.desc1,
          desc2: note.desc2,
          desc3: note.desc3,
          editorURI: note.editorURI,
          updatedAt: note.updatedAt,
          createdAt: note.createdAt,
        },
      });
    }

    console.log('Notes indexed successfully in Elasticsearch');
  } catch (error) {
    console.error('Error indexing notes to Elasticsearch:', error);
    throw error;
  }
}

module.exports = {
  elasticClient,
  searchInElasticsearch,
  indexNotesToElasticsearch,
};
