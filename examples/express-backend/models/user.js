const bcrypt = require("bcryptjs");

const users = [];

class User {
  constructor(id, username, password, playerName) {
    this.id = id;
    this.username = username;
    this.password = bcrypt.hashSync(password, 10);
    this.playerName = playerName;
  }

  // For tutorial purposes only
  static generatePlayerName() {
    const randomPart = Math.random().toString(36).substring(2, 8);
    const timestampPart = Date.now().toString(36);
    return `Player_${randomPart}_${timestampPart}`;
  }

  static findUser(username) {
    return users.find((user) => user.username === username);
  }

  static addUser(username, password) {
    const id = users.length + 1;
    const playerName = generatePlayerName();
    const user = new User(id, username, password, playerName);
    users.push(user);

    return user;
  }
}

module.exports = User;
