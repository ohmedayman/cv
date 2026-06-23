# QCV Authentication

## Overview
QCV uses Firebase Authentication for user management. Users can sign in with email/password, Google, Facebook, or Apple.

## Authentication Methods

### Email/Password
- Users register and login with email and password
- Passwords are securely hashed by Firebase

### Social Login
- Google Sign-In
- Facebook Login
- Apple Sign-In

### Staff Authentication
- Staff members login via the admin panel
- Permissions are stored in Firebase Realtime Database at `/staff/{uid}`
- Admin credentials: admin / Qcv@admin1

## API Access
- Firebase REST API: `https://identitytoolkit.googleapis.com/v1/`
- Project: qwcv-1cfad
- Database: Firebase Realtime Database

## Protected Resources
- `/editor.html` - Requires authentication
- `/admin.html` - Requires staff/admin authentication
- Portfolio pages are public
- Templates gallery is public

## Contact
For authentication issues, contact: support@qcv.vexonet.online
