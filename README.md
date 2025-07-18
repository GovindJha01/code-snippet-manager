# 🧠 CodeCrate – Code Snippet Manager

CodeCrate is a full-stack web application that helps developers save, manage, and organize their code snippets efficiently. Designed with a clean, intuitive UI and developer-first experience in mind, it supports features like real-time search, inline editing, tagging, and user-specific access control.

---

## ✨ Features

- 🔐 User authentication (login/signup with protected routes)
- 🧩 Create, view, edit, and delete code snippets
- 🏷️ Tagging, favoriting, and folder-based snippet organization
- 🔍 Global search across snippets by title, language, tags, or author
- ⚡ Inline editing (only allowed for snippet creators)
- 🌙 Dark mode toggle and user preferences
- 👤 Profile settings and password update
- 🔐 Frontend checks for permissions and secure API calls

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Zustand (for global state management)
- Material UI (for UI components)
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT for authentication

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB (local or cloud)
- npm / yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/codecrate.git
cd codecrate

```
2. **Install dependencies**

```
cd client
npm install
cd ../server
npm install
```

3. ** Add environmental variable**
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```
4. **Start the app**
```
#frontend
cd client
npm run dev

#backend
cd server
npm run dev
```

## 🧪 Upcoming Features
- Snippet sharing and public profiles
- Folder nesting and drag-and-drop organization
- AI-assisted code search

