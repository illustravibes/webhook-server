const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 2000;

app.use(express.json());

// Hubungkan ke MongoDB
mongoose.connect('mongodb+srv://illustravibes:yn0GzB8QQFV9HQ2B@wedding.eutue.mongodb.net/yourDatabaseName', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
   console.log('Connected to MongoDB');
});

// Buat schema dan model untuk data form
const formSchema = new mongoose.Schema({
   name: String,
   email: String,
});

const form = mongoose.model('form', formSchema);

// Endpoint untuk menerima dan menyimpan data dari form
app.post('/webhook', async (req, res) => {
   const form = new form(req.body);
   
   try {
      await form.save(); // Simpan data ke MongoDB
      console.log('Data berhasil disimpan:', form);
      res.status(200).send('Data berhasil disimpan ke database!');
   } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).send('Gagal menyimpan data.');
   }
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
