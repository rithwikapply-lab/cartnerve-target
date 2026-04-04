const { CartNerveAgent } = require('cartnerve-agent')

const agent = new CartNerveAgent({
  apiKey: "cn_d5656fe6bdd83df832076f9c7dcfdd480f560fd969c00b49",
  projectId: "a46fcc94-c88d-45cb-93d3-c451b790c633",
  services: [
    { 
      name: "cartnerve-target", 
      type: "api", 
      endpoint: "https://cartnerve-target-production.up.railway.app/health"
    }
  ]
})

agent.start()
console.log('🤖 CartNerve agent started')
