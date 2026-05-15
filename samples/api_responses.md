# Sample API Responses

This directory contains example API responses for submission reference.

## POST /auth/login
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

## GET /notes/
```json
{
  "notes": [
    {
      "id": 1,
      "title": "Sprint Planning Notes",
      "content": "## Goals\n- Ship auth by Friday\n- Review API structure",
      "tags": "work, planning, sprint",
      "is_public": false,
      "is_archived": false,
      "share_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "owner": "arman",
      "created_at": "2026-05-14T10:00:00",
      "updated_at": "2026-05-15T08:30:00"
    }
  ]
}
```

## POST /notes/{id}/generate-ai
```json
{
  "ai_response": {
    "summary": "A sprint planning session covering authentication, API design, and UI mockup deadlines for the upcoming week.",
    "action_items": [
      "Ship auth by Friday",
      "Review API structure",
      "Prepare UI mockups"
    ],
    "suggested_title": "Sprint Planning — Auth & API Week"
  }
}
```

## GET /dashboard/
```json
{
  "username": "arman",
  "stats": {
    "total": 12,
    "active": 9,
    "archived": 3,
    "public": 2,
    "ai_usage": 7,
    "weekly_activity": 4
  },
  "recent_notes": [
    {
      "id": 1,
      "title": "Sprint Planning Notes",
      "updated_at": "2026-05-15T08:30:00"
    }
  ],
  "most_used_tags": [
    { "tag": "work", "count": 5 },
    { "tag": "planning", "count": 3 },
    { "tag": "ai", "count": 2 }
  ]
}
```

## Database Schema

```sql
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    username    VARCHAR UNIQUE NOT NULL,
    password    VARCHAR NOT NULL,
    ai_usage_count INTEGER DEFAULT 0
);

CREATE TABLE notes (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR NOT NULL,
    content     TEXT,
    tags        VARCHAR,
    is_public   BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    share_id    VARCHAR UNIQUE,
    owner       VARCHAR REFERENCES users(username),
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);
```
