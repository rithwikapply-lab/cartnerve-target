const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

let crashMode = false

// Simulate a crash every 30 seconds
setInterval(() => {
  crashMode = true
  console.log('💥 Simulating crash...')
  setTimeout(() => {
    crashMode = false
    console.log('✅ Service recovered')
  }, 10000) // stays crashed for 10 seconds
}, 30000)

app.get('/', (req, res) => {
  if (crashMode) {
    return res.status(500).json({
      status: 'error',
      message: 'Service unavailable — simulated crash',
      timestamp: new Date().toISOString()
    })
  }
  res.json({
    status: 'ok',
    message: 'CartNerve target service running',
    timestamp: new Date().toISOString()
  })
})

app.get('/health', (req, res) => {
  if (crashMode) {
    return res.status(500).json({ status: 'unhealthy' })
  }
  res.json({ status: 'healthy' })
})

app.listen(PORT, () => {
  console.log(`CartNerve target running on port ${PORT}`)
})
