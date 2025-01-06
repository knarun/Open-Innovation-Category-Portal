const createUser = async (req, res) => {
  const { name, email, password, role } = req.body; // Ensure role is included
  const newUser = new User({ name, email, password, role: role || 'user' }); // Default to 'user'
  await newUser.save();
  // Other logic...
};
