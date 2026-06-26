const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

// Public routes
app.use('/api/auth', require('./routes/auth'))

// Protected routes
const authMiddleware = require('./middleware/auth')
app.use('/api/leads', authMiddleware, require('./routes/leads'))

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Presales API is running!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))