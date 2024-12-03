const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const setupDb = require("../config/db");

// Register new user
exports.register = async (req, res) => {
  const { username, password } = req.body;

  const db = await setupDb(); // Await the database setup
  const existingUser = db.data.users.find((user) => user.username === username);

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: db.data.users.length + 1,
    username,
    password: hashedPassword,
  };

  db.data.users.push(newUser);
  await db.write();

  res
    .status(201)
    .json({ message: "User created successfully", userId: newUser.id });
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const db = await setupDb();
    const user = db.data.users.find((user) => user.username === username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: Number(process.env.JWT_EXPIRATION) }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
