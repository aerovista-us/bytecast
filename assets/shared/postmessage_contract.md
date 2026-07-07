# Orchard / Command Center postMessage Contract (v1)

## Parent → Child
### INIT
```json
{
  "type": "INIT",
  "requestId": "uuid",
  "config": {
    "analyticsEnabled": true,
    "theme": "venta-neon",
    "journeyId": "onboard-seeding",
    "handoffToken": "optional"
  }
}
```

## Child → Parent
### PROGRESS
```json
{ "type":"PROGRESS", "requestId":"uuid", "event":"slide_view", "props":{"slideIndex":3} }
```

### RESULT (artifact)
```json
{
  "type":"RESULT",
  "requestId":"uuid",
  "artifact": { "kind":"zip", "name":"seed_bundle.zip", "href":"./out/seed_bundle.zip", "summary":"..." }
}
```

### COMPLETE / ERROR
```json
{ "type":"COMPLETE", "requestId":"uuid", "props":{"badgeEligible":true} }
{ "type":"ERROR", "requestId":"uuid", "message":"Missing websiteId" }
```
