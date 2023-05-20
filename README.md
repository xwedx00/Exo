# Exo: Secure P2P Messaging App 
🚧 Under Development 🚧

Welcome to Exo, the cutting-edge messaging app designed for professionals and will potentially backed by million-dollar companies! 💬🔒 Exo is currently under development, and we're working tirelessly to bring you the best secure and professional messaging experience.

## Features 🌟
- ✨ State-of-the-Art Encryption: Exo implements the latest and most secure encryption techniques to safeguard the confidentiality and integrity of your messages. Our app leverages XChaCha20-poly1305 and ECC with X25519 for robust public-key cryptography.
- 🌐 Decentralized P2P Messaging: Powered by Gun.js, Exo offers decentralized peer-to-peer messaging capabilities. You can seamlessly send and receive messages directly between devices, ensuring efficient and reliable communication. Even when you're offline, Exo's offline-first approach syncs your messages as soon as you regain connectivity.
- 💾 Offline-First Storage: Exo leverages IndexedDB, a fast and reliable local storage mechanism, for efficient data storage. This ensures that your messages are always accessible, even in offline scenarios.
- 🔌 Real-Time Communication: Exo utilizes sockets.io to facilitate real-time communication, guaranteeing instantaneous message delivery. In cases where a user is unreachable through Gun.js, sockets.io acts as a relay node, ensuring seamless communication between all users.
- 🔒 User Authentication and Authorization: Prioritizing security, Exo enforces robust user authentication on the server side. Users must be authenticated by the server before they can communicate with other authenticated users, providing a secure environment for all interactions.
- 🆔 Anonymous ID: Exo assigns a unique anonymous ID to each user across the entire network. Personal details, such as phone numbers and emails, are never exposed during communication, preserving user privacy at all times.
- 🔐 End-to-End Encryption (E2EE): Exo takes privacy seriously. We have implemented end-to-end encryption for all messages transmitted via Gun.js P2P or the sockets.io server. Only the sender and intended recipient can decrypt and access the messages, ensuring maximum confidentiality.

## Technical Details

Exo's codebase comprises several key files, each playing a crucial role in delivering our innovative solutions:

### Server-side
- `server.ts`: The entry point for the server, responsible for server initialization, route setup, and controller management.
- `controllers/authController.ts`: Handles user authentication functionality, including signup and login processes.
- `controllers/userController.ts`: Manages user-related functionality, such as fetching and updating user data.
- `controllers/messageController.ts`: Provides message-related functionality, facilitating message sending and receiving.
- `models/user.ts`: Defines the User model, specifying the user data schema for the database.
- `routes/authRoutes.ts`: Defines routes for user authentication, such as signup and login routes.
- `routes/userRoutes.ts`: Defines routes for user-related actions, such as fetching user data.
- `middleware/authMiddleware.ts`: Provides middleware functions for user authentication, such as token verification.
- `utils/encryption.ts`: Implements encryption functionality, utilizing XChaCha20-poly1305 and ECC with X25519 for public-key cryptography.
- `utils/keyManagement.ts`: Manages encryption keys, including generation and storage for each user.
- `utils/randomGenerator.ts`: Generates random data, such as salts and initialization vectors, utilized in encryption.
- `utils/cloudBackup.ts`: Enables encrypted cloud backups of user data, ensuring secure storage on a cloud provider.
- `utils/digitalId.ts`: Generates and manages unique Digital IDs for each user, facilitating external database storage.

### Client-side
- `client/app.ts`: The entry point for the client-side application

, responsible for initializing the app and rendering the UI.
- `client/components/Login.tsx`: Renders the login form and handles user authentication on the client-side.
- `client/components/Register.tsx`: Renders the registration form and handles user registration on the client-side.
- `client/components/Chat.tsx`: Provides the main chat interface, displaying messages and enabling message sending and receiving.
- `client/components/MessageList.tsx`: Renders the message list, displaying messages within the chat interface.
- `client/components/MessageForm.tsx`: Renders the message input form, allowing users to enter and send messages.
- `client/components/UserList.tsx`: Renders the user list, displaying online users.
- `client/components/UserListItem.tsx`: Renders a single user item within the user list.
- `client/utils/encryption.ts`: Implements encryption functionality using XChaCha20-poly1305 and ECC with X25519 for public-key cryptography.
- `client/utils/keyManagement.ts`: Manages encryption keys, including generation and storage for each user on the client-side.
- `client/utils/gunOffline.ts`: Enhances Gun.js with offline functionality, enabling message sending and receiving even when offline.
- `client/utils/gunSetup.ts`: Sets up Gun.js database configurations and initializes the database.
- `client/utils/randomGenerator.ts`: Generates random data, such as salts and initialization vectors, used in encryption.
- `client/utils/gunBackup.ts`: Facilitates secure backups of Gun.js data to a cloud storage provider.
- `client/utils/digitalId.ts`: Generates and manages unique Digital IDs for each user.

## Installation

To get started with Exo, follow these steps:

1. Clone the Exo repository: `git clone https://github.com/xwedx00/Exo`
2. Install the necessary dependencies: `npm install`
3. Start the server: `npm run start-server`
4. Launch the client-side app: `npm run start-client`

## Contributions

We welcome contributions from talented developers like you! If you'd like to contribute to Exo's success, please feel free to open pull requests or submit issues on our [GitHub repository](https://github.com/xwedx00/Exo). Together, we can make Exo even better!

## Contact

For any questions, suggestions, or just to say hello, please don't hesitate to reach out to us at [xwedx00@protonmail.com](mailto:xwedx00@protonmail.com).

Join Exo today and experience secure and professional messaging like never before! 💼🔒 Keep an eye on our progress as we bring Exo to life, and stay tuned for updates on our GitHub repository.
