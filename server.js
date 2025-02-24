const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path'); // Přidáme path modul pro práci se souborovými cestami

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Nastavení pro servírování statických souborů z 'public' složky
app.use(express.static(path.join(__dirname, 'public'))); // Servíruj soubory z 'public'

// Hlavní GET endpoint pro stránku
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Odeslat index.html na root cestu
});

// Nastavení MongoDB a dalších funkcionalit
mongoose.connect('mongodb://localhost:27017/booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const BookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  date: String,
  time: String,
});

const Booking = mongoose.model('Booking', BookingSchema);

// Konfigurace emailového účtu
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'your-email@gmail.com', pass: 'your-email-password' },
});

// Definice POST endpointu pro rezervace
app.post('/book', async (req, res) => {
  const { name, email, date, time } = req.body;
  
  const booking = new Booking({ name, email, date, time });
  await booking.save();
  
  // Odeslání potvrzovacího emailu
  await transporter.sendMail({
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Potvrzení rezervace',
    text: `Vaše rezervace na ${date} v ${time} byla úspěšně vytvořena.`,
  });

  res.json({ message: 'Rezervace vytvořena!' });
});

// Spuštění serveru
app.listen(5000, () => {
  console.log('Server běží na portu 5000');
});
