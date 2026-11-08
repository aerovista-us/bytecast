# Agent Day 6 Completion Drill — Access Boundary Review

Complete this after listening to “Safe Access, Roles, and Public/Private Boundaries.”

Use a real or simulated AeroVista access scenario.

## 1. Scenario
Describe the access request or access concern in one clear sentence.

## 2. Actor
Who is the actor?

Choose one:

- Founder / CEO
- Admin
- Operator
- Builder / Creator
- Client
- Employee
- Contractor
- Public visitor
- Agent
- Service account / automation
- Unknown

## 3. Authentication Layer
How is the actor known?

Choose all that apply:

- Cloudflare Access
- Firebase Auth
- Tailscale
- Google identity
- Internal HMAC
- Session token
- API token
- Service credential
- Manual/operator confirmation
- Unknown

## 4. Requested or Actual Role
What role do they have or claim to have?

## 5. Correct Role
What role should they have?

Explain why.

## 6. Scope
What exact scope should apply?

Examples:
- One booth
- All booths
- One client project
- One release
- One division
- One folder
- One dashboard
- One endpoint
- One service
- One temporary session

## 7. Allowed Actions
What should they be able to do?

Choose all that apply:

- View
- Create
- Edit
- Approve
- Assign
- Publish
- Archive
- Delete
- Deploy
- Export
- Administer
- No access

## 8. Environment
Where does this apply?

- Public website
- Authenticated public surface
- Cloudflare-protected tool
- Tailscale-only system
- NXCore internal
- Local dev
- Staging
- Production
- GitHub repo
- Memory vault
- Client portal
- Legal/restricted folder
- Unknown

## 9. Data Sensitivity
What data may become visible?

Choose one:

- Public
- Authenticated but low-risk
- Role-restricted
- Internal
- Restricted
- Secret
- Unknown

## 10. Boundary Check
Answer yes/no:

Known identity:  
Correct role:  
Narrow scope:  
Right environment:  
Minimum data:  
Approval source:  
Audit trail:

## 11. Risk If Wrong
What could happen if access is wrong?

Examples:
- Builder sees another builder’s private draft
- Public visitor sees internal state
- Client sees unrelated client data
- Operator gets founder-level tools
- Secret or credential leaks
- Public page exposes private metadata
- Agent publishes confidential details
- Wrong user can approve or publish

## 12. Severity
Choose one:

- P1 — potential exposure, secrets, client data, private data, or live trust risk
- P2 — active work blocked or role mismatch without known exposure
- P3 — low-risk cleanup or stale label
- Unknown — escalate before acting

Explain why.

## 13. Safe Interim Action
What should happen immediately?

Examples:
- Fail closed
- Remove risky grant
- Hide route
- Pause publishing
- Escalate to founder
- Escalate to legal/compliance
- Escalate to Nexus/security
- Verify role source
- Check backend scope filter
- Check Cloudflare policy
- Check registry assignment
- Write handoff

## 14. Evidence Needed
What evidence is needed?

Choose all that apply:

- Live route check
- Role source
- Registry entry
- Cloudflare policy
- Firebase user record
- Backend /me response
- Handoff
- EOD Capsule
- Legal agreement / SOW
- Operator instruction
- Access logs
- Public page check
- Test result

## 15. Public/Private Classification
Classify the surface or data:

- Public
- Authenticated
- Role-restricted
- Internal
- Restricted
- Secret

## 16. Handoff Note
Write a safe handoff note.

Do not include secrets or private data.

Format:

Access scenario:  
Expected access:  
Actual access:  
Risk:  
Severity:  
Immediate action:  
Owner/lane:  
Sensitive evidence omitted: Yes / No  
Next verification step:

## 17. Final Access Decision
Choose one:

- Approve as requested
- Approve with narrower scope
- Deny
- Fail closed pending review
- Escalate before decision
- Unknown — insufficient evidence

Explain in 3 sentences or fewer.
