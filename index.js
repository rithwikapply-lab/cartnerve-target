const express = require('express')
const https = require('https')
const app = express()
const PORT = process.env.PORT || 3000

const CARTNERVE_API_KEY = process.env.CARTNERVE_API_KEY
const SERVICE_NAME = 'cartnerve-target'
const SERVICE_URL = process.env.CARTNERVE_SERVICE_URL

let crashMode = false
let crashCount = 0

// Report metrics to CartNerve every 10 seconds
function reportMetrics(status, errorRate, latency) {
  const payload = JSON.stringify({
    service: SERVICE_NAME,
    url: SERVICE_URL,
    status: status,
    metrics: {
      error_rate: errorRate,
      latency_ms: latency,
      uptime: process.uptime()
    },
    timestamp: new Date().toISOString()
  })

  const options = {
    hostname: 'cartnerve.com',
    path: '/api/agent/ping',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CARTNERVE_API_KEY}`,
      'Content-Length': Buffer.byteLength(payload)
    }
  }

  const req = https.request(options, (res) => {
    console.log(`📡 CartNerve ping: ${res.statusCode}`)
  })

  req.on('error', (e) => {
    console.error(`❌ CartNerve ping failed: ${e.message}`)
  })

  req.write(payload)
  req.end()
}

// Ping CartNerve every 10 seconds
setInterval(() => {
  if (crashMode) {
    reportMetrics('unhealthy', 100, 9999)
  } else {
    reportMetrics('healthy', 0, Math.floor(Math.random() * 20) + 5)
  }
}, 10000)

// Simulate a crash every 30 seconds
setInterval(() => {
  crashMode = true
  crashCount++
  console.log(`💥 Simulating crash #${crashCount}...`)
  reportMetrics('unhealthy', 100, 9999)
  setTimeout(() => {
    crashMode = false
    console.log('✅ Service recovered')
    reportMetrics('healthy', 0, 10)
  }, 10000)
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
    crash_count: crashCount,
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
  console.log(`API Key: ${CARTNERVE_API_KEY ? 'set' : 'MISSING'}`)
  console.log(`Service URL: ${SERVICE_URL}`)
})
