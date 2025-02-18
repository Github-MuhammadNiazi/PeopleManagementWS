# People Management WS

## Introduction
People Management WS is a web and mobile application designed to streamline communication and service management for residential communities. This project enables residents to receive notifications, apply for services, report complaints, and interact efficiently with the management team.

## Tech Stack
### Frontend
- **Framework**: Expo(React)
- **Language**: TypeScript (Optional, but recommended)
- **State Management**: Context API / Redux (Future Scope)
- **Styling**: Tailwind CSS / Styled Components

## Features (Planned)
- 🔔 **Real-time Notifications**: Stay updated with management announcements.
- 📑 **Service Requests**: Apply for society services seamlessly.
- 🛠 **Complaint Management**: Report issues and track resolution progress.
- 📊 **Dashboard & Analytics**: View statistics and reports (Future Scope).

## Project Structure
```
PeopleManagementWS/
├── .expo/ # Expo configuration files
├── app/ # Expo Router App
│   ├── _layout.tsx # Root layout file
│   ├── (tabs)/ # Tab navigation screens
│   │   ├── explore.tsx # Explore screen
│   │   ├── index.tsx # Home screen
│   │   └── _layout.tsx # Tab layout file
│   ├── +not-found.tsx # Not found screen
├── assets/ # Static assets (fonts, images, etc.)
├── components/ # Reusable UI components
│   ├── tests/ # Component tests
│   ├── ui/ # UI-specific components
├── constants/ # Constants (e.g., Colors)
├── hooks/ # Custom hooks
├── scripts/ # Utility scripts
├── .gitignore # Git ignore file
├── app.json # Expo app configuration
├── package.json # Project dependencies and scripts
├── tsconfig.json # TypeScript configuration 
└── README.md # Project documentation
```

## Installation & Setup
### Clone Repository
```sh
git clone https://github.com/Github-MuhammadNiazi/PeopleManagementWS.git
cd PeopleManagementWS
```

### Web Setup
```sh
npm install
npm run web
```
Open `http://localhost:8081` to view the web app.

### Mobile Setup (React Native)
```sh
npm install
npm run android  # For Android
npm run ios       # For iOS (Mac required)
```

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Added a feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request.

## License
This project is licensed under the MIT License.

