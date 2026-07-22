
export const register = (req, res) => {
  const { email, password } = req.body;

  // Check if data is missing (Makes the second test pass)
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // TODO: In the real app, you will hash the password and save to MongoDB here.
  
  // Send the success response (Makes the first test pass)
  res.status(201).json({
    message: 'User registered successfully',
    token: 'fake_jwt_token_for_now' 
  });
}