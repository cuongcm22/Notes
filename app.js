require('dotenv').config();

const express = require("express");
const path = require('path');
const methodOverride = require('method-override');

const app = express();
const colors = require('colors');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Sử dụng method-override để xử lý các form có phương thức PUT, DELETE
app.use(methodOverride('_method'));

// Connect mongodb
const connectDB = require('./src/config/database'); 
connectDB();

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

// ===#=== Route config ===#===

const authRouter = require('./src/routes/auth.routes')
const noteRouter = require('./src/routes/note.routes')

app.use(process.env.API_VER + 'auth', authRouter)
app.use(process.env.API_VER + 'note', noteRouter)

// ============================

// Test route
// Route hiển thị index.pug
app.get('/', (req, res) => {
    res.render('home/dashboard');
  });

app.get('/test', (req, res) => {
    res.render('index');
  });



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
