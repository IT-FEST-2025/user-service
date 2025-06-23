class User {
  constructor({
    id = null,
    email = null,
    passwordHash = null,
    fullName = null,
    username = null,
  }) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.fullName = fullName;
    this.username = username;
  }

  setGender(gender) {
    const allowedGenders = ["pria", "wanita", "lainnya", null];
    if (!allowedGenders.includes(gender)) {
      throw new Error("Gender harus 'pria', 'wanita', atau 'lainnya'");
    }
    this.gender = gender;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      fullName: this.fullName,
      age: this.age,
      gender: this.gender,
      height: this.height,
      weight: this.weight,
      username: this.username,
    };
  }
}

export default User;
