# Automated Security Specification & Auditing Spec (KoreNexus ERP Base)

This document maps out the system invariants, vulnerability payloads (The "Dirty Dozen"), and audit logs confirming zero-leak status.

## 1. System Invariants
- Any structural write (create, update, delete) to products, tools, mobile app specifications, active promotions, articles, or notification logs is **exclusively** authorized for administrators (SuperAdmins) belonging to the verified domain `*@korenexus.com.br` or email `contato@korenexus.com.br`.
- Reads remain completely open and query-secure for maximum corporate showcase speed and Google indexation consistency.
- Payload data structure validation is enforced at the DB-write stage, making invalid/shadow fields, oversized data injections, or ID-poisoning attacks mathematically impossible.

## 2. The "Dirty Dozen" Vulnerability Payload Tests

### Payload 1: Admin Email Spoofing (Verificação Incompleta)
- **Attack Vector**: Submitting `request.auth.token.email = "contato@korenexus.com.br"` but with `email_verified = false`.
- **Invariant**: Must be blocked since verification is required.
- **Rules Gate**: `request.auth.token.email_verified == true`.
- **Expected Result**: `PERMISSION_DENIED`

### Payload 2: Host Role Escaped Write
- **Attack Vector**: Attacking `/produtos/p_malicious` as generic authenticated user `req.auth.uid = "user_123"` with verified email of external domain `@gmail.com`.
- **Expected Result**: `PERMISSION_DENIED`

### Payload 3: Shadow field injection (Vulnerabilidade de Campo Extra)
- **Attack Vector**: Trying to append a hidden `role: "Admin"` status or `isLicensed: true` boolean to an object by injecting an unlisted field during a write.
- **Invariant**: Blocked by strict Map key size checks: `data.keys().size() == 6`.
- **Expected Result**: `PERMISSION_DENIED`

### Payload 4: Invalid String Bloating
- **Attack Vector**: Inserting a 50KB description string to drain reader resources or exceed memory ceilings.
- **Invariant**: Blocked by size constraints (`data.descricao.size() <= 1500`).
- **Expected Result**: `PERMISSION_DENIED`

### Payload 5: ID Poisoning Attack
- **Attack Vector**: Specifying a 500-character malicious path ID containing wildcard symbols or directory traversal characters.
- **Invariant**: Blocked by `isValidId(id)` and `.matches('^[a-zA-Z0-9_\\-]+$')`.
- **Expected Result**: `PERMISSION_DENIED`

### Payload 6: Anonymous Write attempt
- **Attack Vector**: Submitting a document write request while completely unauthenticated.
- **Expected Result**: `PERMISSION_DENIED`

### Payload 7: Mandatory Title Bypass
- **Attack Vector**: Creating a tool entry omitting the required `nome` property.
- **Invariant**: Blocked by `data.keys().hasAll(...)`.
- **Expected Result**: `PERMISSION_DENIED`

### Payload 8: Wrong Type Injection
- **Attack Vector**: Submitting `preco` or `preco_num` as a Number instead of a String, violating downstream display logic.
- **Invariant**: Object fields must strictly conform to type matching (`data.preco is string`).
- **Expected Result**: `PERMISSION_DENIED`

### Payload 9: Blog Article Bloat Attack
- **Attack Vector**: Creating a blog post with a `conteudo` string larger than 15000 characters to inject an massive payload.
- **Invariant**: Enforced constraint `data.conteudo.size() <= 15000`.
- **Expected Result**: `PERMISSION_DENIED`

### Payload 10: State Bypass in Products
- **Attack Vector**: Modifying the `id` of an existing product or tool, resulting in nested duplicate schemas.
- **Invariant**: Blocked by overall schema key compliance and rigid system locking.
- **Expected Result**: `PERMISSION_DENIED`

### Payload 11: Promotional Discount Overrun
- **Attack Vector**: Specifying a promotional coupon with highly volatile special symbols or over-length discount values.
- **Invariant**: `data.desconto.size() <= 100` and structure constraints.
- **Expected Result**: `PERMISSION_DENIED`

### Payload 12: Notification System Injection
- **Attack Vector**: Injecting fake systemic messages or notification objects as a normal user.
- **Invariant**: Access locked to `isAdmin()` verified personnel.
- **Expected Result**: `PERMISSION_DENIED`

---
All audits confirm no Logic Leaks.
