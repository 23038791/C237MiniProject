const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const app = express();

//set up multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => { //callback function
        cb(null, 'public/image'); //null is error, public is folder, image is subfolder
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); //null is error, file.originalname is the name of the file
    }
});

const upload = multer({ storage: storage });

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'c237_affirm'
});


connection.connect((error) => {
    if (error) {
        console.error('Error connecting to MySQL: ', error);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Set the view engine 
app.set('view engine', 'ejs');
// enable static files
app.use(express.static('public'));
//enable form processing
app.use(express.urlencoded({
    extended: false
}));

// read
app.get('/', (req, res) => { //get all of affirmers
    const sql = 'SELECT * FROM affirmers';
    // Fetch data from MySQL
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error: ', error.message);
            return res.status(500).send('Error Retrieving affirmers');
        }
        // Render HTML page with data
        res.render('home', { affirmers: results });
    });
});

app.get('/affirmer/:id', (req, res) => { //get affirmer by id
    // Extract the affirmer ID from the request parameters
    const affirmer_id = req.params.id;
    // Inner join 2 tables to get affirmer and affirmation data
    const sql = 'SELECT * FROM affirmers INNER JOIN affirmations ON affirmers.affirmer_id = affirmations.affirmer_id WHERE affirmers.affirmer_id = ?';
    // Fetch data from MySQL based on affirmer ID
    connection.query(sql, [affirmer_id], (error, results) => {
        if (error) {
            console.error('Database query error: ', error.message);
            return res.status(500).send('Error Retrieving affirmers by ID');
        }
        // Check if any affirmer with the given ID was found
        if (results.length > 0) {
            // Render HTML page with affirmer data
            res.render('affirmer', { affirmer: results[0] }); //results[0] is the first affirmer
        } else {
            res.status(404).send('affirmer not found');
        }
    });
});

//create
app.get('/addAffirmer', (req, res) => { //request and response from the addAffirmer page
    res.render('addAffirmer'); //compile into HTML & send to client as response
});

//form action submit all in ejs
app.post('/submit', upload.single('image'), (req, res) => { //upload.single('image') is the middleware
    //extract affirmer data
    const { name, contact, specialty } = req.body;
    let image;
    if (req.file) {
        image = req.file.filename;
    } else {
        image = null;
    }
    //insert affirmer data into MySQL
    const sql = 'INSERT INTO affirmers (name, contact, specialty, image) VALUES (?, ?, ?, ?)';
    connection.query(sql, [name, contact, specialty, image], (error, results) => {
        if (error) {
            console.error('Error adding affirmer:', error);
            return res.status(500).send('Error adding affirmer');
        }
        res.redirect('/');
    });
});//

// edit
app.get('/editAffirmer/:id', (req, res) => {
    const affirmer_id = req.params.id;
    const sql = 'SELECT * FROM affirmers WHERE affirmer_id = ?';
    connection.query(sql, [affirmer_id], (error, results) => {
        if (error) {
            console.error('Database query error: ', error.message);
            return res.status(500).send('Error Retrieving affirmer by ID');
        }
        if (results.length > 0) {
            res.render('editAffirmer', { affirmer: results[0] });
        } else {
            res.status(404).send('affirmer not found');
        }
    });
});

// form action subject/<%= affirmer.affirmer_id %> in ejs
app.post('/submit/:id', upload.single('image'), (req, res) => {
    const affirmer_id = req.params.id;
    const { name, contact, specialty } = req.body;
    let image = req.body.currentImage;
    if (req.file) {
        image = req.file.filename;
    }
    const sql = 'UPDATE affirmers SET name = ?, contact = ?, specialty = ?, image = ? WHERE affirmer_id = ?';
    connection.query(sql, [name, contact, specialty, image, affirmer_id], (error, results) => {
        if (error) {
            console.error('error updating affirmer: ', error);
            res.status(500).send('Error updating affirmer by ID');
        } else {
            res.redirect('/');
        }
    });
});// update display

//delete
app.get('/deleteAffirmer/:id', (req, res) => {
    const affirmer_id = req.params.id;
    const sql = 'DELETE FROM affirmers WHERE affirmer_id = ?';
    connection.query(sql, [affirmer_id], (error, results) => {
        if (error) {
            //handle any error that occurs during the database operation
            console.error('Database query error: ', error.message);
            res.status(500).send('Error deleting affirmer by ID');
        } else {
            res.redirect('/'); //redirect to the home page
        }

    });
});// update display

//save affirmer
app.get('/saveAffirmer', (req, res) => { //request and response from the saveAffirmer page
    res.render('saveAffirmer'); //compile into HTML & send to client as response
});

app.get('/saveAffirmer/:id', (req, res) => {
    const affirmer_id = req.params.id;
    const sql = 'SELECT * FROM affirmers WHERE affirmer_id = ?';
    connection.query(sql, [affirmer_id], (error, results) => {
        if (error) {
            console.error('Database query error: ', error.message);
            return res.status(500).send('Error Retrieving affirmer by ID');
        }
        if (results.length > 0) {
            res.render('saveAffirmer', { affirmer: results[0] });
        } else {
            res.status(404).send('affirmer not found');
        }
    });
});

app.post('/saveAffirmer/:id', (req, res) => {
    // Assuming you have a function to fetch affirmer details by ID
    getAffirmerDetails(req.params.id, (error, affirmerDetails) => {
        if (error) {
            // Handle error (e.g., affirmer not found or database error)
            res.status(500).send('Error fetching affirmer details');
        } else {
            // Render the saveAffirmer template with affirmer details
            res.render('saveAffirmer', { 
                id: req.params.id,
                affirmer: affirmerDetails 
            });
        }
    });
});

app.get('/talk', (req, res) => {
    res.render('talk');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});// link to local host