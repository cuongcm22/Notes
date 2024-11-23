const express = require("express");
const path = require('path');

const app = express();

// Cấu hình middleware để phục vụ tệp tĩnh từ thư mục "src/assets"
app.use(express.static(path.join(__dirname, 'src', 'assets')));
console.log(path.join(__dirname, 'src', 'assets'));

// Body parser middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cấu hình view engine là Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src/views'));

// Route hiển thị index.pug
app.get('/', (req, res) => {
    res.render('home/dashboard');
  });

app.get('/test', (req, res) => {
    res.render('index');
  });



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
