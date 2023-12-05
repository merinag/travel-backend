// require("dotenv").config();

const express = require('express');
const sequelize = require('./database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
// const fs = require("fs");
const cors = require('cors');

// const cookieParser = require("cookie-parser");

const User = require('./models/user');
const BookingModule = require('./models/booking');
const Booker = require('./models/bookers');

const Booking = require('./models/booking'); // Replace with the correct path


const Users = [];

// app.use(cookieParser());
const secretKey = '111-mer';

app.use(cors({ origin: '* ' }));
app.use(express.urlencoded());
sequelize.sync({ force: true }).then(() => {
  console.log('db is ready');
  BookingModule.addDefaultBooking();
});

app.use(express.json());

app.use(express.static('images'));

app.get('/contact-regi', function (req, res) {
  res.render('contact-regi');
});

function authenticateUser(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: 'No authorization header provided' });
  }
  // Split the header into "Bearer" and the token
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res
      .status(401)
      .json({ message: 'Invalid authorization header format' });
  }
  const token = parts[1];
  try {
    const user = jwt.verify(token, secretKey);
    console.log('::::::::::::::::::::');
    console.log(user);
    console.log('::::::::::::::::::::');
    req.user = user.dataValues;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
//   if (username && password) {
//     const user = users.find((u) => u.username === username);

//     if (user && bcrypt.compareSync(password, user.password)) {
//       const token = jwt.sign({ username }, secretKey);
//       res.cookie('token', token, { httpOnly: true });
//       res.json({ message: 'Login successful' });
//     } else {
//       res.status(401).json({ error: 'Invalid credentials' });
//     }
//   } else {
//     res.status(400).json({ error: 'Username and password are required' });
//   }
// });

app.get('/user', authenticateUser, async (req, res) => {
  res.json(req.user.username);

});

app.post('/contact-regi', async function (req, res) {
  const { name, email, username, password } = req.body;

  if (!username || !password || !email) {
    console.log('error');

    res.status(400).json({ error: 'Username and password are required' });
  } else {
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
      await User.create({
        name: name,
        email: email,
        username: username,
        password: hashedPassword,
      });
      res.status(200).json({ message: 'User registered sucessfully' });

      // return res.render("contact-regi");
    } catch (error) {
      console.error(error);
      console.log(':::::::OOOOOOOSSSSSS');
      res.status(500).json({ error: 'An error occured' });
    }
  }
});
// app.post('/book' ,authenticateUser ,  (req,res)=>{

// })

app.post('/contact-login', async function (req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
  } else {
    try {
      const user = await User.findOne({
        where: { username },
      });
      console.log('PPPPPPPPPPPPPPP');
      console.log(user);
      console.log('PPPPPPPPPPPPPPP');

      if (!user) {
        res.status(401).json({ error: 'no user found' });
      } else {
        const passwordMatch = bcrypt.compareSync(password, user.password);
        console.log('::::::::: :: ::: : : : : : ');
        console.log(passwordMatch);
        console.log('::::::::: :: ::: : : : : : ');
        if (passwordMatch) {
          const token = jwt.sign({ ...user }, secretKey, {
            expiresIn: '1h',
          });

          res.status(200).json({ message: 'Login successful', token });
          console.log("tttttttttttttoken", token);
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  }
});

app.post('/contact-logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
  res.redirect('http://localhost:3000/home');
});

app.post('/appointments', authenticateUser, (req, res) => {
  // const name= User.username
  const { date, time } = req.body;
  if (date && time) {
    appointments.push({ date, time, user: req.user.username });
    res.status(201).json({ message: 'Appointmet booked successfully' });
  } else {
    res.status(400).json({ error: 'Date and time are required' });
  }
});


app.get('/bookings', async (req, res) => {

  const result = await BookingModule.Bookings.findAll();
  console.log('::::::::::::::::::::::::::::::');
  console.log(result);
  console.log('::::::::::::::::::::::::::::::');
  res.send(result);
});



app.get('/book', async (req, res) => {
  try {
    let books = await Booker.findAll({
      order: [['createdAt', 'desc']],
      // include: [
      //   {
      //     model: Booking, // Assuming the model is named Booking
      //     attributes: ['img'] // Assuming img is an attribute of the Booking model
      //   }
      // ]
    });

    console.log('""""""""""""""""""""""""""""""""""""')
    console.log(books)
    console.log('""""""""""""""""""""""""""""""""""""')

    res.json({ success: true, books });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }
});


app.post('/book', authenticateUser, async (req, res) => {
  const body = req.body;
  const id = req.user.id;
  console.log('UserID:', id);

  try {
    const data = {
      date: body.date,
      phoneNumber: body.phone,
      guest: body.guest,
      bookingId: parseInt(body.bookingId),
      id: req.user.id,
    };

    Booker.create(data);
    res.send(data);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.listen(3001, () => {
  console.log('backend running');
});


// app.post('/book', async (req, res) => {
//   const body = req.body;
//   // const userId = req.user.id
//   const data = {
//     date: body.date,
//     phoneNumber: body.phone,
//     guest: body.guest,
//     bookingId: parseInt(body.bookingId),
//   };
//   try {
//     Booker.create(data);
//     res.send(data);
//     console.log(data)

//   } catch (error) {
//     console.log(error)
//   }
// });
// app.post('/book', authenticateUser, async (req, res) => {
//   const body = req.body;
//   const id = req.user.id
//   try {
//     const data = {
//       date: body.date,
//       phoneNumber: body.phone,
//       guest: body.guest,
//       bookingId: parseInt(body.bookingId),
//       id: req.user.id
//     };
//     console.log("user", req.user)
//     if (
//       await User.findOne({
//         where: {
//           id
//         },
//       })
//     ) {
//       Booker.create(data);
//       res.send(data);
//       console.log(data)
//     } else {
//       console.log('User not found');
//       res.status(401).json({ message: 'User not authorized' });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });



// async function getBook(req, res, next) {
//   try {
//     const bookings = await Booking.findAll({
//       order: [['createdAt', 'desc']],
//       include: [/* Include associations if needed */]
//     });

//     res.bookings = bookings;
//     next();
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// }

// app.post("/users", (req, res) => {
//   User.create(req.body).then(() => {
//     res.send("user is inserted");
//   });
// });

// app.get("/users", authenticateToken, async (req, res) => {
//   const user = await User.findAll();
//   res.send(user);
// });

// app.get("/users/:id", async (req, res) => {
//   const requsetId = req.params.id;
//   const user = await User.findOne({
//     where: {
//       id: requsetId,
//     },
//   });
//   res.send(user);
// });

// app.put("/users/:id", async (req, res) => {
//   const requsetId = req.params.id;
//   const user = await User.findOne({
//     where: {
//       id: requsetId,
//     },
//   });
//   user.username = req.body.username;
//   await user.save();

//   res.send("updated");
// });

// app.delete("/users/:id", async (req, res) => {
//   const requsetId = req.params.id;
//   await User.destroy({ where: { id: requsetId } });
//   res.send("removed");
// });
// const posts =[
//   {
//     username:"mer",
//     tite:"p1"
//   },{
//     username:"sel",
//     tite:"p2"
//   }
// ]

// app.get('/posts', authenticateToken,(req,res)=>{
// req.json(posts.filter(post =>post.username ===req.user.name))
// })

// app.post("/login", (req, res) => {
//   const { username } = req.body.username
//   const user = { name: username };
//   const accesToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
//   res.json({ accesToken });
// });

// function authenticateToken(req, res, next) {
//   const authHeader = req.header["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }


