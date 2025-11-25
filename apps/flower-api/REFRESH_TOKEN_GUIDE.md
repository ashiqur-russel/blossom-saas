# Refresh Token Guide

## What are Refresh Tokens?

Refresh tokens are long-lived tokens used to obtain new access tokens without requiring the user to log in again.

## Why Use Refresh Tokens?

### Security Benefits:
1. **Short-lived access tokens**: Access tokens expire quickly (15 minutes), limiting damage if stolen
2. **Reduced attack window**: Even if an access token is compromised, it expires soon
3. **Automatic re-authentication**: Users stay logged in without frequent password entry
4. **Revocation capability**: Can invalidate refresh tokens on logout or security events

### User Experience:
- Users don't need to log in frequently
- Seamless session continuation
- Better mobile/web app experience

## How Refresh Tokens Work

```
1. User logs in → Receives:
   - Access Token (short-lived, e.g., 15 minutes) → Stored in localStorage/memory
   - Refresh Token (long-lived, e.g., 7 days) → Stored in HTTP-only cookie

2. Access token expires → Frontend automatically:
   - Calls /auth/refresh endpoint with refresh token from cookie
   - Receives new access token
   - Continues working seamlessly

3. Refresh token expires → User must log in again
```

## Two Approaches: Stateless vs Stateful

### 1. Stateless (Current Implementation - After Your Request)
**How it works:**
- Refresh token stored ONLY in HTTP-only cookie
- Token validated by JWT signature only
- No database lookup for token validation

**Pros:**
- ✅ No database queries for token validation
- ✅ Better performance
- ✅ Simpler implementation
- ✅ Scales horizontally (no shared state)

**Cons:**
- ❌ Cannot revoke tokens until expiration
- ❌ Cannot track active sessions
- ❌ If token is stolen, it's valid until expiry
- ❌ No token rotation (security risk)

### 2. Stateful (Database Storage)
**How it works:**
- Refresh token stored in HTTP-only cookie AND database
- Token validated against database on each refresh
- Can revoke tokens immediately

**Pros:**
- ✅ Can revoke tokens immediately (logout, security breach)
- ✅ Token rotation (old token invalidated when new one issued)
- ✅ Can track active sessions/devices
- ✅ Better security control

**Cons:**
- ❌ Database lookup on each refresh
- ❌ Slightly more complex
- ❌ Requires database for token validation

## Best Practice Recommendation for a  Project

### Recommended: **Hybrid Approach** (Best of Both Worlds)

For a business application :

1. **Store refresh tokens in database** (stateful)
2. **Use token rotation** (invalidate old token when issuing new one)
3. **Store in HTTP-only cookies** (secure, not accessible via JavaScript)
4. **Short access token expiry** (15 minutes)
5. **Long refresh token expiry** (7 days)

### Why This is Best for a Project:

1. **Security**: Business data needs protection
   - Can revoke access immediately if needed
   - Token rotation prevents token reuse attacks
   - Can track who's logged in

2. **User Management**: 
   - Admin can see active sessions
   - Can force logout users
   - Better audit trail

3. **Performance**: 
   - Database lookup is minimal (indexed by userId)
   - Only happens on refresh (not every request)
   - Acceptable trade-off for security

4. **Compliance**:
   - Better for business applications
   - Can demonstrate security controls
   - Audit trail for compliance

## Implementation Details

###  Flow ( Stateless):
```
Login → Generate tokens → Store refresh in cookie only
Refresh → Validate JWT signature → Issue new tokens
Logout → Clear cookie only (token still valid until expiry)
```

### Recommended Flow (Stateful with Rotation):
```
Login → Generate tokens → Store refresh in cookie + DB
Refresh → Validate JWT + Check DB → Rotate token (invalidate old, issue new)
Logout → Clear cookie + Remove from DB → Immediate revocation
```

## Security Best Practices

1. **HTTP-only cookies**: Prevents XSS attacks
2. **Secure flag in production**: HTTPS only
3. **SameSite=strict**: Prevents CSRF attacks
4. **Token rotation**: Invalidate old tokens
5. **Short access token expiry**: 15 minutes
6. **Long refresh token expiry**: 7 days (configurable)
7. **Separate secrets**: Different secrets for access and refresh tokens

## Recommendation

**For a business application, use the stateful approach with database storage.**

Reasons:
- Business application needs security controls
- Ability to revoke access is important
- Token rotation prevents security issues
- Database lookup overhead is minimal
- Better user management capabilities



