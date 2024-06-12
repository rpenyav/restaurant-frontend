# Restaurant Frontend

This is the frontend application for the restaurant management system. It allows users to manage orders, invoices, and user profiles.

## Features

- User authentication and authorization
- Order management
- Invoice management
- User profile management
- Multi-language support (i18n)
- Responsive design

## Technologies Used

- React
- TypeScript
- Axios
- Bootstrap 5
- React-i18next
- SweetAlert2
- date-fns

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- Yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/restaurant-frontend.git
   cd restaurant-frontend
   ```

2. Install dependencies:

```

yarn install

```

3. Create a .env file in the root of the project and add the following:

```

REACT_APP_API_BASE_URL=http://localhost:3000

```

### Running the Application

To start the application, run:

```
yarn start
```

This will run the app in development mode. Open http://localhost:3001 to view it in the browser.

### Building the Application

To build the application for production, run:

```
yarn build
```

This will create an optimized production build in the build folder.

### Running Tests

To run tests, use:

```
yarn test
```

## Directory Structure

```
src/
|-- api/
|   |-- axios.ts
|-- components/
|   |-- AdminRoute.tsx
|   |-- BreadcrumbComponent.tsx
|   |-- FacturaDetail.tsx
|   |-- FacturaList.tsx
|   |-- FacturaPreview.tsx
|   |-- LoaderComponent.tsx
|   |-- Login.tsx
|   |-- NavbarComponent.tsx
|   |-- NotFoundComponent.tsx
|   |-- OrderList.tsx
|   |-- UpdateOrder.tsx
|   |-- UserProfile.tsx
|-- context/
|   |-- AuthContext.tsx
|   |-- OrderContext.tsx
|   |-- UserContext.tsx
|-- hooks/
|   |-- useOrderInfo.ts
|   |-- useCamareroInfo.ts
|-- interfaces/
|   |-- order.ts
|   |-- factura.ts
|   |-- user.ts
|-- layout/
|   |-- Layout.tsx
|-- pages/
|   |-- Order.tsx
|-- router/
|   |-- PrivateRoute.tsx
|   |-- AuthRoute.tsx
|-- services/
|   |-- searchService.ts
|   |-- salaService.ts
|   |-- userService.ts
|-- utils/
|   |-- dateUtils.ts
|-- i18n.ts
|-- App.tsx
|-- index.tsx

```

### Translations

The application supports multiple languages using react-i18next. The default language is Spanish. You can switch between languages using the provided language buttons in the UI.

### Date Formatting

Date formatting is handled using date-fns with support for multiple locales. Ensure the correct locale is set in the i18n.ts configuration file.
