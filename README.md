# Fetch Dog Adoption Platform

A modern web application for finding and adopting dogs from shelters following the requirements outlined [https://frontend-take-home.fetch.com/](here). Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔐 authentication system
- 🐕 Comprehensive dog search with multiple filters:
  - Breed
  - Age Range
  - Name
  - Zip Codes
- 📱 Responsive design for all devices
  - light / dark os theme detection and support
- ❤️ Favorite dogs and match generation system
- 🌍 Geolocation support to show user's distance from dogs

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **API**: Fetch API with TypeScript interfaces
- **Authentication**: HTTP-only cookies

## Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd fetch-take-home
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## API Integration

The application integrates with the Fetch API endpoints:

- `POST /auth/login` - User authentication
- `GET /dogs/breeds` - Fetch available dog breeds
- `GET /dogs/search` - Search for dogs with filters
- `POST /dogs` - Fetch detailed dog information
- `POST /dogs/match` - Generate a match from favorites
- `POST /locations/search` - Search for locations

## Project Structure

```
app/
├── components/     # Reusable UI components
├── contexts/      # React context providers
├── services/      # API service functions
├── types/         # TypeScript type definitions
└── page.tsx       # Main application page
```

