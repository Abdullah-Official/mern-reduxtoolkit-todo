const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 8000;
const User = require("./models/user.js");
const Todo = require("./models/todo.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {JWT_SECRET, MONGOURI} = require('./config/keys');

mongoose.connect(
  MONGOURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  }
);

app.use(express.json());

mongoose.connection.on("connected", () => {
  console.log("Database Connected");
});
mongoose.connection.on("error", (err) => {
  console.log("Database dropped", err);
});



const requireLogin = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "You must be authorized" });
  }
  try{
    const { userId } = jwt.verify(authorization, JWT_SECRET);
  req.user = userId;
  next();
  }catch(err) { 
    return res.status(401).json({error:'You must be logged inn..'})
  }
};


app.get('/test', requireLogin, (req,res) => {
  return res.json({message: req.user})
})

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(422).json({ error: "Please add all fields." });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(422).json({ error: "User aleady exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await new User({
      email,
      password: hashedPassword,
    }).save();
    res.status(200).json({ message: "Users sign up successfully .. :)" });
  } catch (err) {
    console.log("Error during signup ", err);
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(422).json({ error: "Please add all fields." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User doesn't exists" });
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET);
      res
        .status(201)
        .json({ message: "User Logged INN successfully .. :)", token });
    }
    res.status(401).json({ message: "Email or Password in incorrect" });
  } catch (err) {
    console.log("Error during signup ", err);
  }
});


app.post('/createtodo', requireLogin, async (req,res) => {
const data = await new Todo({ 
    todo: req.body.todo,
    todoBy: req.user
  }).save()
  res.status(201).json({message: data})

})


app.get('/gettodo', requireLogin, async (req,res) => {
  const data = await Todo.find({
    todoBy: req.user
  })
  res.status(200).json({message: data})
})

app.delete('/remove/:id', requireLogin, async (req,res) => {
 const removedTodo = await Todo.findByIdAndDelete({_id: req.params.id})
 res.status(200).json({message: removedTodo})
})

if(process.env.NODE_ENV == 'production'){
  const path = require('path')
  app.get('/', (req,res) => {
    app.use(express.static(path.resolve(__dirname, 'todo-client', 'build')))
    res.sendFile(path.resolve(__dirname, 'todo-client', 'build', 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log("Server is running");
});
