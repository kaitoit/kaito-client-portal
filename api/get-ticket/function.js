{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get"],
      "route": "get-ticket"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
