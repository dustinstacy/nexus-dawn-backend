<h1 align="center">
Nexus Dawn Backend
</h1>

<p align="center">
  <img alt="GitHub Release" src="https://img.shields.io/github/v/release/dustinstacy/nexus-dawn-backend">
  <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/dustinstacy/nexus-dawn-backend">
  <a href="./#license"><img src="https://img.shields.io/badge/License-MIT-brightgreen"/></a>
</p>

<p align="center">
  <a href="#description">Description</a> •
  <a href="#local-setup">Local Setup</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

---

<div align="center">
<a href="https://nexus-dawn.vercel.app">
<img height='400px' src='https://res.cloudinary.com/dsv7k92lb/image/upload/v1687034760/Nexus%20Dawn/logos/logo_c9eaj0.png' alt='logo'/>
</a>
</div>

## Description

The backend of the [Nexus Dawn](https://nexus-dawn.vercel.app) web app runs on this Express.js RESTful API server, handling everything you need, like user profiles, card collections, deck creation, game progress, and more.

## Local Setup

```bash
# Clone this repository
git clone https://github.com/dustinstacy/nexus-dawn-backend.git

# Go into the server repository
cd nexus-dawn-backend

# Install dependencies
npm install

# Run the server
npm run dev
```

Next, setup your enivornment variables (Mostly optional) by creating a .env file in the root directory

```bash
# nexus-dawn-backend/.env

# OPTIONAL: By default the server will run on http://localhost:5000
# The port number you want the server to run on
PORT=<number>

# OPTIONAL: By default the nexus-dawn frontend will run on http://localhost:3000
# The port number the frontend is running on (if not 3000)
CLIENT_PORT=<number>

# NECESSARY: Secret for JWT generation and verification
# The stronger the better for security purposes
JWT_SECRET=<string>

# NECESSARY: Cloudinary
# Go to https://console.cloudinary.com/settings/<cloudinary user id>/api-keys and copy values. Cloud name can be found next to the page heading "API Keys"
CLOUDINARY_CLOUD_NAME=<string>
CLOUDINARY_API_KEY=<number>
CLOUDINARY_API_SECRET=<string>

# NECESSARY
# Path where avatars should be stored in the form /path/to/avatars
CLOUDINARY_AVATARS_FOLDER=<string>

```

To utilize the frontend alongside this server, head over to the [frontend](https://github.com/dustinstacy/nexus-dawn) repo and follow
the Local Setup steps minus the server setup you've already done here.

## Contributing

Interested in contirbuting? Check out the current [issues](https://github.com/dustinstacy/nexus-dawn-backend/issues) or submit your own idea.

1. Fork it!: `git clone https://github.com/dustinstacy/nexus-dawn-backend.git`
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## License

The MIT License (MIT)
