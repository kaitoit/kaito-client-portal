{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get"],
      "route": "get-tickets"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
