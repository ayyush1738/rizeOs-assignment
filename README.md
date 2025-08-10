# rizeOs-assignment

A Web3-enabled job and social platform backend and frontend, supporting decentralized wallet authentication and on-chain payments for platform fees.

---

## Description

This project is a full-stack platform for job searching, posting, and applications, with an integrated professional newsfeed and AI-powered job matching. It offers Web3 functionality, allowing users to link their crypto wallet and requiring an on-chain transaction for job postings. Backend is built with Node.js, Express, and PostgreSQL; the frontend uses React/Next.js and ethers.js for blockchain interaction.

---

## Backend API Endpoints

### Authentication

| Method | Endpoint                         | Description               |
| ------ | ------------------------------- | ------------------------- |
| POST   | `/api/v1/auth/register`          | Register new user         |
| POST   | `/api/v1/auth/login`             | Login and get JWT         |

### User Profile

| Method | Endpoint                                 | Description                              |
| ------ | --------------------------------------- | ---------------------------------------- |
| GET    | `/api/v1/user/profile/:username`         | View any public profile by username      |
| GET    | `/api/v1/user/profile`                   | Get own profile (JWT required)           |
| PUT    | `/api/v1/user/profile`                   | Update your profile (JWT required)       |

- *User profiles support storing a unique Web3 wallet address.*

### Jobs

| Method | Endpoint                                 | Description                                            |
| ------ | --------------------------------------- | ------------------------------------------------------ |
| POST   | `/api/v1/jobs/create`                    | Create job (JWT required, via frontend after fee paid) |
| GET    | `/api/v1/jobs/list`                      | Browse all jobs                                        |
| GET    | `/api/v1/jobs/:id`                       | Get details for a single job                           |
| POST   | `/api/v1/jobs/:id/apply`                 | Apply to a job, with cover letter (JWT required)       |
| GET    | `/api/v1/jobs/applied`                   | Get list of job IDs you have applied to                |
| GET    | `/api/v1/jobs/:id/applicants`            | Get applicants for your job (JWT required, owner only) |
| POST   | `/api/v1/jobs/match`                     | Upload resume (.pdf) and receive matched jobs (AI)     |

### Social Feed

| Method | Endpoint                                 | Description                     |
| ------ | --------------------------------------- | ------------------------------- |
| POST   | `/api/v1/feed/post`                      | Create a new social post        |
| GET    | `/api/v1/feed/timeline`                  | Get the feed/timeline           |
| POST   | `/api/v1/feed/:postId/like`              | Like or unlike a post           |
| POST   | `/api/v1/feed/:postId/comment`           | Comment on a post               |
| GET    | `/api/v1/feed/:postId/comments`          | Get comments for a post         |

---

## Web3 Functionality

### Wallet Integration

- Users can connect and display their Ethereum wallet address directly in their profile.
- The API and frontend both support storing and retrieving wallet addresses.

### On-chain Platform Fee for Job Posting

- To post a job, users **must pay an on-chain platform fee** (example: 0.001 ETH).  
- The frontend integrates with the user's browser wallet (e.g., MetaMask via wagmi/ethers.js), confirms the on-chain payment, and only then calls `/api/v1/jobs/create`.
- Platform fee contract is hardcoded in the frontend:
  - **Platform Fee Contract**: `0x2b4DaD65A49dd4F03eA41C9Ed8557c84Da1136F7`
  - **Platform Fee Amount**: 0.001 ETH (can be set/updated as needed)

**Posting a job proceeds as:**
1. User clicks "Post a Job" in the UI. Prompted to connect wallet if disconnected.
2. Upon posting, a transaction is initiated from the user's wallet to the platform fee contract.
3. Only after successful transaction, frontend sends job data to `/api/v1/jobs/create` (backend).
4. Jobs created are listed and visible to all.

### Blockchain Readiness

- All users may link an EVM wallet.
- The backend schema and endpoints are prepared for potential on-chain verification, decentralized identity, or future upgrades that require blockchain signature validation.

---

## AI-Powered Job Matching

- Users upload a resume; backend parses resume with NLP and matches against available jobs using TF-IDF similarity.
- Returns sorted jobs ranked by best match.

---

## Technologies Used

- **Node.js / Express.js** – API backend
- **PostgreSQL** – Database; schema supports Web3 fields
- **JWT** – Authentication
- **ethers.js**, **wagmi** – Frontend wallet and blockchain utility
- **multer** – Resume file uploading
- **natural**, **pdfjs-dist** – Resume parsing and job skill matching
- **React / Next.js** – Frontend (for wallet, job board, social feed)
- **Lucide-React** – Iconography

---

## Environment Variables

- `DATABASE_URL` – PostgreSQL connection string
- `JWT_SECRET` – JWT secret key
- `NEXT_PUBLIC_API_URL` – Base URL for API in frontend

---

## Database (PostgreSQL) Tables

- `users`: id, email, username, password, full_name, wallet_address, location, bio, skills, profile_picture, resume_url, created_at
- `jobs`: id, user_id (FK to users), company_name, title, description, skills, budget, location, created_at
- `job_applications`: id, user_id, job_id, cover_letter, status, applied_at, UNIQUE(user_id, job_id)
- `posts`, `post_likes`, `post_comments`: for newsfeed/social layer

---


---

## How to Run

1. Install dependencies:  
   `npm install`  
2. Configure `.env`:  
   - Set `DATABASE_URL` and `JWT_SECRET`  
   - For frontend, set `NEXT_PUBLIC_API_URL`
3. Initialize the database (automatic on server start)
4. Start backend:  
   `npm run dev` or `node index.js`
5. Start frontend and access on browser

---

## Important Notes

- Posting a job requires *both* wallet connection and payment of the platform fee on-chain via the user's connected wallet.
- Wallet integration is required for job creation, highly recommended for profile enrichment and future blockchain-enabled features.
- No smart contract interaction needed for general browsing, searching, applying, or the social features.

---

This project brings together Web2 and Web3 for a seamless job and professional network, setting the foundation for decentralized work credentials and transactions.


