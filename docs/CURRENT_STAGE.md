# ComiLink Current Development State

## Project

ComiLink NFC Social Exchange System MVP

Core flow:

NFC touch
→ open user page
→ auto create collection relationship
→ view stamp and social links

Tech stack:

* Next.js App Router
* TypeScript
* PostgreSQL
* Prisma
* Tailwind CSS

---

# Current Progress

## Completed

### Stage 1

* Next.js project initialized
* Tailwind configured
* Prisma installed
* PostgreSQL connected
* Git repository initialized

### Stage 2

* Prisma schema implemented
* Migration works
* Database validated

Implemented models:

* User
* SocialLink
* Event
* Collection

Important constraints:

* QQ unique
* token unique
* one collection pair per event
* nullable eventId unique index manually added
* only one active event

### Stage 3

* Auth system implemented
* QQ + password login
* Session Cookie auth
* logout
* change password
* GET /api/me

### Stage 4

* /me profile page implemented
* edit username
* upload stamp image
* manage social links

### Stage 5

* /u/[token] public page implemented
* public profile view works
* token 404 handling works

---

# Current Stage

Stage 6:
Implement automatic collection logic.

Requirements:

* logged-in user visits another user's NFC page
* automatically create collection relationship
* self visit should not collect
* repeated visits should not duplicate
* works with or without active event
* collection relationship must be bidirectional logically
* database must remain concurrency-safe

Needed APIs:

* POST /api/collections/collect
* GET /api/collections

Needed pages:

* /me/collections

---

# Important MVP Constraints

DO NOT IMPLEMENT:

* chat
* feed/community
* ranking
* achievements
* OAuth
* registration
* websocket
* push notifications
* multi-stamp system

Focus only on MVP.

---

# Development Rules

* One feature per task
* Small commits
* Do not refactor unrelated code
* Do not redesign architecture
* Use existing Prisma schema
* Use existing session auth system
* Use Next.js App Router
* Use TypeScript

After modifying code:

1. explain changed files
2. explain how to run
3. explain how to test
4. explain possible edge cases
