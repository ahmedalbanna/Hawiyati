# Hawiyati - هويتي (Digital Civil Registry)

## Bounded Contexts (Domains)

1. **/domains/identity**
   - **Back:** `server/identityController.ts`, `models/Citizen.ts`
   - **Front:** `components/IdentityCard.tsx`, `pages/Enrollment.tsx`
   - **Purpose:** Core identity management (Face/Voice).

2. **/domains/family**
   - **Back:** `models/Family.ts`
   - **Front:** `components/FamilyLink.tsx`
   - **Purpose:** Linking citizens into family units.

3. **/domains/verification**
   - **Front:** `pages/VerifyIdentity.tsx`
   - **Purpose:** QR scanning and public verification portal.

4. **/domains/core**
   - **Shared:** `components/layout/`, `utils/voiceProcessing.ts`, `theme/`

## Tech Stack
- **Frontend:** React + Vite + TailwindCSS + Motion.
- **Backend:** Express (Module-based API).
- **Security:** RSA-encrypted QR data & Voice Hashing simulations.
- **AI:** Gemini Flash for "Voice-to-Data" extraction simulation.
