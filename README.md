# Logistics Backend

This project is a backend system for a simplified logistics application that supports dynamic pricing and currency conversion. It is built with TypeScript, Express.js, Firebase, and integrates with a currency exchange API.

## Features

- CRUD operations for managing partners, packages, and countries.
- Dynamic pricing system with currency conversion.
- Firebase integration for database and hosting.
- Environment-based configuration for flexibility.

## Prerequisites

Before setting up the project, ensure you have the following installed on your system:

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **Firebase CLI** (for deploying to Firebase)
- **Git** (for cloning the repository)

## Setup Instructions:

Follow these steps to set up the project locally:

### 1. Install Dependencies

Run the following command to install the required dependencies:

`npm install`

### 2. cd to functions folder

`cd functions`

### 3. Set Up Environment Variables

In the ideal world these variables would be in the .env file and fetched from there but, but the firebase function didn't load the .env file and i didn't want to waste any time on that so the configuration variables can be found in the file: `functions/src/config/firebaseConfig.ts`

### 4. Firebase Configuration:
```
apiKey: <your-firebase-api-key>
authDomain: <your-firebase-auth-domain>
projectId: <your-firebase-project-id>
storageBucket: <your-firebase-storage-bucket>
messagingSenderId: <your-firebase-sender-id>
appId: <your-firebase-app-id>
```
### Currency API varables:
the configuration variables can be found in the file `functions/src/services/currencyConversionService.ts`
note: You can use this `apiKey` which is already set in the `currencyConversionService.ts`

```
apiUrl: https://openexchangerates.org/api/latest.json
apiKey: 6be40a01cd3040a48ec55be57ad6826c
```


### 5. Login into firebase
run `firebase login` and then choose project


### 6. Deploy
run `firebase deploy --only functions`

### 7. Key routes for testing the functionality 

method get `your-domain/partners/packages`  Fetch all the partners with their packages across all the countries <br>
method get `your-domain/partners/:partnerId/packages`  Fetch all the packages across all the countries for a given partner <br>
method get `your-domain/partners/:partnerId/packages/:packageId/pricing`  Fetch the pricing for a given partner and package <br>
method get `your-domain/partners/:partnerId/packages/:packageId/pricing` Fetch the pricing for a given partner and package. If you provide additional param <br> `?currency=EUR` will convert that price to the given currency <br>

method post `your-domain/partners/pricing`  This will update the price for a given partner and package "add the JSON in the body -> raw" <br>
JSON structure
```
{
    "partnerId":"EvfuujDLEnslAjXRkXXK",
    "packageId": "p91EDkB5nuiFZS7D08EM",
    "price": 123 
}
```

# Folder Structure

```
TESTCASE/
│
├── lib/                     # Compiled output (ignored in Git)
├── src/                      # Source code
│   ├── config/               # Configuration files (e.g., Firebase setup)
│   ├── controllers/          # Express route controllers
│   ├── routes/               # API route definitions
│   ├── services/             # Business logic and services
│   ├── types/                # TypeScript types
│   ├── app.ts                # Main app configuration
│   └── index.ts             # Entry point of the application
├── package.json              # npm package configuration
├── tsconfig.json             # TypeScript configuration

```
### 6. Note:
After i deploy the function i've changed my local development steup and i was aware of the validation that I've missed for the types.
I didn't want to waste more time for that but if i do that i would use the `express-validator` for that.

