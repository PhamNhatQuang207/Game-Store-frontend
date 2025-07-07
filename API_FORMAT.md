# API Format Requirements

## Game API

### POST /games (Add Game)

```json
{
  "name": "Game Name",
  "genreId": "5", // Note: genreId must be a string even though it's a numeric ID
  "releaseDate": "2023-01-01", // ISO date format
  "price": 49.99
}
```

### PUT /games/{id} (Update Game)

```json
{
  "id": 1,
  "name": "Updated Game Name",
  "genre": "Adventure", // Original genre field for display
  "genreId": "5", // Added genreId field as string
  "releaseDate": "2023-01-01",
  "price": 59.99
}
```

### GET /games (Get All Games)

Response format:

```json
[
  {
    "id": 1,
    "name": "Game Name",
    "genre": "Adventure", // Only returns genre name, not ID
    "releaseDate": "2023-01-01",
    "price": 49.99
  }
]
```

## Notes

1. When adding a new game, the API expects `genreId` as a string, not a number.
2. When updating a game, include both the `genre` (name) and `genreId` (as string).
3. The API returns games with only the genre name in the `genre` field.

Remember to properly handle these format requirements in your frontend code.
