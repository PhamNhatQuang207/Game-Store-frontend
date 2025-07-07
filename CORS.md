# CORS Handling in Game Store Application

## What is CORS?

Cross-Origin Resource Sharing (CORS) is a security feature implemented by web browsers that restricts web pages from making requests to a different domain than the one that served the original page.

## Solution Overview

This application uses Angular's built-in proxy capabilities to handle CORS issues during development:

1. **Proxy Configuration**: The `proxy.conf.json` file routes API requests through the Angular dev server
2. **API URL**: All service calls use `/api` as the base URL which gets proxied to the backend

## How to Start the Application

Run the application with proxy enabled:

```bash
npm start
```

This automatically applies the proxy settings and routes all `/api/*` requests to `http://localhost:5017/*`.

## How It Works

When you make a request to:
- `/api/games` in your Angular app

The proxy will forward it to:
- `http://localhost:5017/games` on your backend

The browser only sees communication with the same origin (the Angular dev server), so no CORS issues occur.

## Alternative Solutions

If you need to configure the backend instead:

### ASP.NET Core Backend

```csharp
// In Program.cs or Startup.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev",
        builder => builder
            .WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// In the middleware pipeline
app.UseCors("AllowAngularDev");
```

### Node.js Express Backend

```javascript
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:4200'
}));
```
