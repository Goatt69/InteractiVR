# VR Application Integration Guide: Backend to Frontend

This guide walks through the integration of your NestJS backend with your Next.js frontend for your VR application, focusing on architecture, communication flow, and best practices.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Communication Architecture](#communication-architecture)
3. [Frontend Organization](#frontend-organization)
4. [API Integration Layer](#api-integration-layer)
5. [Authentication Flow](#authentication-flow)
6. [VR Data Flow](#vr-data-flow)
7. [State Management](#state-management)
8. [Error Handling Strategy](#error-handling-strategy)
9. [Deployment Considerations](#deployment-considerations)
10. [Testing Integration](#testing-integration)

## Project Overview

Your application consists of:

- **Frontend**: Next.js application with VR components using Three.js/React Three Fiber
- **Backend**: NestJS application with modules for authentication, objects, themes, and users

The integration focuses on connecting these systems while maintaining clean separation of concerns.

## Communication Architecture

### API Communication Flow

```
VR Components → Frontend Services → API Layer → Backend Controllers → Backend Services → Database
             ↑                                                                              |
             |-------------------------- Response Data ------------------------------------|
```

### Key Integration Points

1. **Authentication**: JWT-based auth between frontend and backend
2. **VR Objects**: Fetching 3D objects and their metadata
3. **Themes**: Managing visual themes for VR environments
4. **User Data**: Managing user preferences and settings

## Frontend Organization

Expand your frontend structure to include:

```
frontend/
├── components/
│   ├── vr/
│   │   ├── Scene.tsx
│   │   ├── Controls.tsx
│   │   └── VREnvironment.tsx
│   ├── layout/         # Add layout components
│   ├── common/         # Add reusable UI components
│   └── forms/          # Add form components for data entry
├── hooks/              # Add custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   ├── useVRObjects.ts # VR objects data hook
│   └── useTheme.ts     # Theme management hook
├── pages/
│   ├── index.tsx
│   ├── login.tsx
│   ├── experience/[id].tsx # VR experience page
│   └── admin/          # Admin pages
├── public/
│   ├── assets/
│   │   ├── models/
│   │   ├── textures/
│   │   └── panoramas/
├── services/
│   ├── api.ts          # Base API configuration
│   ├── auth.service.ts # Authentication service
│   ├── objects.service.ts # Objects service
│   ├── theme.service.ts   # Theme service
│   └── user.service.ts    # User service
├── store/              # State management
│   ├── auth/
│   ├── vr/
│   └── theme/
├── types/              # TypeScript types
│   ├── api.types.ts    # API response types
│   ├── vr.types.ts     # VR-specific types
│   └── theme.types.ts  # Theme types
└── utils/              # Utility functions
    ├── api.utils.ts    # API helper functions
    └── vr.utils.ts     # VR helper functions
```

## API Integration Layer

### Service Organization

Create separate service files for each backend module:

1. **Base API Service (`services/api.ts`)**
   - Configure Axios or fetch with interceptors
   - Handle JWT token management
   - Set base URLs for environments

2. **Module-Specific Services**
   - `auth.service.ts`: Login, register, token refresh
   - `objects.service.ts`: CRUD for VR objects
   - `theme.service.ts`: Theme management
   - `user.service.ts`: User profile management

### Example API Service Structure (No Code)

Each service should follow a consistent pattern:
- Import base API configuration
- Define typed request/response interfaces
- Create service methods that map to backend endpoints
- Handle errors consistently

## Authentication Flow

1. **Login Flow**
   - User enters credentials
   - Frontend calls auth service
   - Backend validates and returns JWT
   - Frontend stores token securely
   - API service adds token to requests

2. **Token Management**
   - Store tokens in memory + HTTP-only cookies
   - Implement token refresh mechanism
   - Handle expired tokens

3. **Protected Routes**
   - Create auth guard for frontend routes
   - Mirror backend role-based access

## VR Data Flow

### Loading VR Objects

1. Frontend requests object data from backend
2. Backend returns metadata including asset URLs
3. Frontend loads 3D models via Three.js/React Three Fiber
4. Consider implementing:
   - Progressive loading for large scenes
   - Asset preloading for critical objects
   - Level-of-detail strategies

### Real-time Considerations

If your VR app has multiplayer/real-time features:
- Consider WebSockets for real-time updates
- Implement efficient state synchronization

## State Management

1. **Choose a State Management Approach**
   - React Context + hooks for simpler states
   - Redux/Zustand for complex state
   - React Query for server state

2. **State Organization**
   - Auth state: User info, permissions
   - VR state: Scene objects, interactions
   - UI state: Theme preferences, interface state
   - Application state: Current experience, global settings

## Error Handling Strategy

1. **Frontend Error Handling**
   - Create consistent error boundaries
   - Implement retry mechanisms for transient failures
   - Design user-friendly error messages

2. **API Error Handling**
   - Map backend error codes to user-friendly messages
   - Create error interceptors in API service
   - Log errors for debugging

## Deployment Considerations

1. **Environment Configuration**
   - Create environment variables for API endpoints
   - Set up different configs for dev/staging/prod

2. **CORS Configuration**
   - Ensure backend CORS settings match frontend domains
   - Handle credentials properly

3. **Asset Optimization**
   - Use CDN for VR assets
   - Implement compression for 3D models
   - Consider dynamic loading based on device capabilities

## Testing Integration

1. **Integration Testing**
   - Test API service methods
   - Mock backend responses
   - Verify data flows correctly to components

2. **E2E Testing**
   - Test complete user flows
   - Verify VR interactions work with backend data

## Implementation Plan

### Phase 1: Basic API Integration
- Set up API service structure
- Implement authentication flow
- Create basic data fetching for VR objects

### Phase 2: VR Object Integration
- Connect VR components to backend data
- Implement object loading and rendering
- Set up theme application to VR environment

### Phase 3: Complete Features
- Implement full CRUD operations
- Add real-time features if needed
- Polish error handling and edge cases

Follow this plan to create a robust integration between your NestJS backend and Next.js frontend for your VR application.
