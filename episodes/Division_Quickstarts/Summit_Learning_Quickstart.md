# Summit Learning — Micro‑Academy Pilot (3 weeks)

## Problem
Skills are uneven; compliance topics don’t stick.

## Scope
- Curriculum outline (3 modules)
- Lessons with assessments + rubric
- Rollout plan + metrics

## Deliverables
- 3 lessons + quizzes
- Feedback form + reporting template

## Success Criteria
- ≥80% “useful” rating
- ≥20% improvement on post‑assessment





          /* Write only if user is room creator or host */
          ".write": "auth != null && ( \
            root.child('rydesync').child('rooms').child($roomId).child('createdBy').val() === auth.uid || \
            root.child('rydesync').child('rooms').child($roomId).child('participants').child(auth.uid).child('role').val() === 'host' \
          )",



          /* Write only if user is room creator or host */
          ".write": "auth != null && ( \
            root.child('rydesync').child('rooms').child($roomId).child('createdBy').val() === auth.uid || \
            root.child('rydesync').child('rooms').child($roomId).child('participants').child(auth.uid).child('role').val() === 'host' \
          )",
