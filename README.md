# Proposal for Exo App

## Introduction

Exo is a state-of-the-art encrypted file sharing and messaging application that prioritizes security, privacy, and user experience. By leveraging advanced technologies such as the Signal Protocol, decentralized peer-to-peer (P2P) messaging, offline-first storage, and real-time communication, Exo provides a secure and seamless file sharing and messaging experience. This proposal outlines the key features and technical details of Exo.

## Key Features

1. **File Sharing using Signal Protocol and CDNs**
   - Enable users to share various file types, including images, videos, and audio files.
   - Implement the Signal Protocol for end-to-end encryption of shared files, ensuring robust data confidentiality and integrity.
   - Integrate with a Content Delivery Network (CDN) for efficient storage and delivery of shared files.

2. **End-to-End Encryption (E2EE) of Messages and File Sharing**
   - Utilize the Signal Protocol to establish secure communication channels for both messages and shared files.
   - Implement encryption utility functions, including encryptMessage, decryptMessage, encryptFile, and decryptFile, to ensure data privacy.

3. **Decentralized P2P Messaging with Gun.js**
   - Leverage Gun.js, a decentralized graph database, to enable peer-to-peer messaging within Exo.
   - Empower direct communication between devices, ensuring reliable messaging even in scenarios where the server is unreachable.

4. **Offline-First Storage with PouchDB**
   - Implement PouchDB, a fast and reliable local storage mechanism, to enable offline messaging and file access.
   - Store messages and shared files locally and synchronize them with the server when an internet connection becomes available.

5. **Real-Time Communication using Sockets.io**
   - Utilize Sockets.io to enable real-time communication between users, facilitating instantaneous message delivery.
   - Enhance the messaging experience through efficient and responsive socket-based communication.

6. **User Authentication and Authorization with SuperTokens**
   - Implement robust user authentication and authorization using SuperTokens, ensuring secure communication channels between authenticated users.
   - Safeguard user data and maintain the integrity of the messaging and file sharing functionalities.

7. **Unique Anonymous IDs for User Privacy**
   - Assign unique anonymous IDs to each user to protect their privacy and prevent the exposure of personal details.
   - Enable seamless communication within the Exo app while preserving user anonymity.

## Tech Stack

**Frontend:**
- Framework: React
- Performance Optimization: Qwik

**Backend:**
- Runtime Environment: Node.js
- Web Framework: Express

**P2P Messaging:**
- Library: Gun.js
- Offline Messaging: P2P-Socket.io

**Encryption:**
- Protocol: Signal Protocol

**Storage:**
- Database: Prisma, PlanetScale
- Local Storage: PouchDB

**Real-Time Communication:**
- Library: Sockets.io

**Authentication:**
- Solution: SuperTokens

**CDN:**
- Custom CDN Integration

**Load Balancer:**
- Options: HAProxy or Nginx

## Frontend Directory Structure

```plaintext
- components/: Reusable UI components
- chat/: Chat UI components (message input, message list, file sharing UI)
- user/: User interface components (login, registration, profile, etc.)
- pages/: Application pages and routes
  - chat/: Chat page and route
  - user/: User page and route
- utils/: Helper functions and utilities
- encryption/: Encryption utility functions (e.g., encryptMessage, decryptMessage, encryptFile, decryptFile)
- network/: Network utility functions (e.g., sendP2PMessage, handleP2PMessage)
- api/: API service for communicating with the backend
- config/: Configuration files (e.g., API endpoints, CDN configuration)
```

## Backend Directory Structure

```plaintext
- controllers/: API controllers (e.g., handleLogin, handleRegistration, handleFileUpload)
- routes/: API routes (e.g., /auth/login, /chat/send-message, /user/update-profile)
- data/: Prisma and PlanetScale data storage integration
- models/: Prisma models (e.g., User, Message, File)
- migrations/: Prisma migration files
- encryption/: Signal Protocol implementation for E2EE
  - protocol/: Signal Protocol implementation files (e.g., signal-protocol.js)
  - utils/: Encryption utility functions (e.g., encryptMessage, decryptMessage, encryptFile, decryptFile)
- cdn/: CDN integration and file storage management functions
- storage/: Temporary storage management functions (e.g., storeFile, deleteFile)
- loadbalancer/: Load balancing implementation using HAProxy or Nginx
- config/: Load balancer configuration files (e.g., haproxy.config, nginx.config)
- p2p/: socket.io-p2p integration for local network messaging
  - network/: Socket.io network files (e.g., socket-network.js, socket-peer.js)
  - utils/: P2P utility functions (e.g., sendP2PMessage, handleP2PMessage)
```

## Conclusion

With the proposed architecture and features, Exo aims to provide a secure, reliable, and efficient file sharing and messaging experience. By leveraging cutting-edge technologies such as the Signal Protocol, P2P messaging, offline-first storage, and real-time communication, Exo ensures user privacy, data integrity, and seamless communication. The outlined directory structure and tech stack will enable modularity, scalability, and maintainability of the codebase, facilitating future enhancements and improvements to the Exo app.
