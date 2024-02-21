## Table of Contents

- [Demo](https://patient-dashboard-delta.vercel.app)
- [Tech Stack](#tech-stack)
- [How it works](#how-it-works)
- [Getting Started Locally](#getting-started-locally)
- [Api Helpers](#api-helpers)
- [Interfaces](#interfaces)
- [Types](#types)
- [Auth Class](#auth-class)
  - [Class Structure](#class-structure)
  - [Auth Class Methods](#auth-class-methods)
    - [handleError](#handleerror-err)
    - [loginWithEmail](#loginwithemail-email-password)
    - [loginWithProvider](#loginwithprovider)
    - [createUserWithEmail](#createuserwithemail-email-password)
    - [signup](#signup-provider-google--email-email-password)
    - [signOut](#signout)
    - [get](#get-id)
    - [create](#create-id-email-extrafields-iuser)
- [Patient Class](#patient-class)
  - [Class Structure](#class-structure-1)
  - [Patient Class Methods](#patient-class-methods)
    - [set](#set-patient-ipatient)
    - [get](#get-id-string)
    - [create](#create-patientdata-ipatient)
    - [update](#update-patientdata-ipatient)
    - [delete](#delete-patientdata-ipatient)
    - [list](#list)
- [TODO](#todo)
  - [Features](#features)

## Demo

View the [Demo](https://patient-dashboard-delta.vercel.app)

## Tech Stack

The Patient Management Dashboard is built using the following technologies:

### Front-end

- [Next.js](https://nextjs.org/): A React framework for building server-side rendered and statically generated web applications.
- [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript that adds static types to the language.
- [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework that provides a set of pre-designed styles and classes for building responsive user interfaces.

### Back-end

- [Next.js Server Routes](https://nextjs.org/docs/api-routes/introduction): We use Next.js server routes as the backend for handling API requests and serving data to the front-end. Next.js server routes provide an easy way to create API endpoints and interact with our Firebase Firestore database.

### Database

- [Firebase](https://firebase.google.com/): A cloud-based platform by Google that provides services for building and managing web and mobile applications. We are using Firebase Firestore as the database for storing patient and user data.

### Authentication

- [Firebase Authentication](https://firebase.google.com/docs/auth): Firebase's authentication service that provides easy-to-use authentication for our web app. We support authentication with email & password and OAuth providers like Google.

### Deployment

- [Vercel](https://vercel.com/): A platform for deploying and hosting web applications. We use Vercel to deploy the Patient Management Dashboard.

View the [Demo](https://patient-dashboard-delta.vercel.app)

### Version Control

- [Git](https://git-scm.com/): A distributed version control system used for tracking changes in our codebase and collaborating with multiple developers.

### Continuous Integration/Continuous Deployment (CI/CD)

- [Vercel](https://vercel.com/): Our deployment platform also offers CI/CD capabilities, enabling us to automatically build and deploy changes to production.
- [Husky](https://typicode.github.io/husky/#/): A tool that allows us to add git hooks to our project. We use Husky to set up a pre-commit hook to run ESLint on staged files before committing.
- [lint-staged](https://github.com/okonet/lint-staged): A tool that runs linters on only the files that are staged for committing. We use lint-staged in conjunction with Husky to ensure that only properly formatted code is committed to the repository.
- [ESLint](https://eslint.org/): A popular JavaScript and TypeScript linter that helps us maintain consistent code style and catch potential issues.

## How it works

1. Sign up [Here](https://patient-dashboard-delta.vercel.app)
2. Add a patient by clicking the blue button labelled `Add patient`
3. Add multiple addresses by clicking `Add address`
4. Add custom fields by clicking `Add custom field`; Select the field type either `text` or `number`
5. Hit `Add patient` to save the new patient
6. Click on the patient in the table to open their information, there you can edit and delete the patient
7. To filter patients you can click the `Filter` button near the `Add patient` button
8. On the side panel you can select multiple filters
9. You can filter for dates after a certain date by only entering the `from` date
10. You can search for dates before a certain date by only entering the `to` date
11. If you want to search between dates enter both `from` and `to` dates
12. Click `Clear` if you need to clear the dates. CAUTION: This will reset all the active filters
13. Click `Apply` to apply the filters
14. You can then refine the search by using the search bar, this will search through all fields including the patient's name, dob, addresses, and custom fields

## Getting Started Locally

### Built using Next.js, and Firebase Firestore Database

First, install the dependencies:

```bash
yarn
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Next add your firebase config to your .env.local file:

```sh
NEXT_PUBLIC_FIREBASE_APIKEY==""
NEXT_PUBLIC_FIREBASE_AUTHDOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECTID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSEGE_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
```

Start the project:

```bash
yarn dev
```

## Api Helpers

Api methods can be accessed as a service.

Example:

```typescript
import * as api from "utils/helpers/api";

// Example
const addNewPatient = async (values: IPatient) => {
  try {
    await api.patient.create(values);
  } catch (err) {
    console.log("ERROR Failed to create patient", err);
  }
};
```

## Interfaces

```typescript
interface IUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
}
interface IErrorMessage {
  success: boolean;
  message: string;
  code?: string;
  data?: any;
}

interface NotificationProps {
  text?: string;
  href?: string;
  ctaText?: string;
  variant?: TNotificationVariants;
}

interface INotification {
  show: boolean;
  text?: string;
  href?: string;
  ctaText?: string;
  variant?: TNotificationVariants;
  delay?: number;
}

interface ISelectOption {
  label: string;
  value: string;
}

interface IName {
  first: string;
  middle: string;
  last: string;
}

interface IAddress {
  primary: boolean;
  street: string;
  streetNumber: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
}

interface IPatient {
  id: string;
  name: IName;
  dob: string;
  status: TStatusFilterOption;
  addresses?: IAddress[];
  additionalFields?: {
    fieldType: TFieldTypes;
    fieldValue: string;
    fieldLabel: string;
  }[];
}

interface IPatientFilters {
  status: TStatusFilterOption[];
  dob: string[];
  cities: string[];
  provinces: string[];
}
```

## Types

```typescript
type TNotificationVariants = "default" | "success" | "error";

type TPatientFilterHandler<IPatient> = (patient: IPatient) => boolean;

type TStatusFilterOption = "inquiry" | "onboarding" | "active" | "churned";

type TFieldTypes = "text" | "number";
```

## Auth Class

The `Auth` class is a utility class used for handling authentication logic. It provides methods to handle user login, signup, and sign-out, as well as methods to fetch and create user data.

### Class Structure

```typescript
class Auth {
  user?: IUser;
  error?: IErrorMessage;

  constructor(user?: IUser, error?: IErrorMessage);

  handleError(err: any): IErrorMessage;

  async loginWithEmail(email: string, password: string): Promise<any>;

  async loginWithProvider(): Promise<any>;

  async createUserWithEmail(email: string, password: string): Promise<any>;

  async signup(
    provider: "google" | "email",
    email?: string,
    password?: string
  ): Promise<any>;

  async signOut(): Promise<any>;

  async get(id: string): Promise<IUser | IErrorMessage>;

  async create(
    id: string,
    email: string,
    extraFields?: IUser
  ): Promise<IUser | IErrorMessage>;
}

export default Auth;
```

### Auth Class Methods

#### `handleError (err: any)`

```typescript
// Handle and format error responses from Firebase Authentication.
handleError(err: any): IErrorMessage {
  // Implementation here...
}
```

#### `loginWithEmail (email: string, password: string)`

Authenticate user using email and password.

#### `loginWithProvider ()`

Authenticate user using a provider (Google). Opens a popup for account selection.

#### `createUserWithEmail (email: string, password: string)`

Create a new user account using email and password.

#### `signup (provider: 'google' | 'email', email?: string, password?: string)`

Sign up a user. If provider is 'email', create a new user account using email and password. If provider is 'google', sign in using Google provider and create a user account if it's a new user.

#### `signOut ()`

Sign out the authenticated user.

#### `get (id: string)`

Fetch user data by ID from the server.

#### `create (id: string, email: string, extraFields?: IUser)`

Create a user account with the provided ID and email on the server. Optionally, additional user fields can be provided in extraFields.

## Patient Class

The `Patient` class is a utility class used for handling patient-related operations. It provides methods to fetch patient data, create a new patient, update patient information, and list all patients.

### Class Structure

```typescript
class Patient {
  id: string;
  name: IName;
  dob: string;
  status: TStatusFilterOption;
  addresses?: IAddress[];
  additionalFields?: {
    fieldType: TFieldTypes;
    fieldValue: string;
    fieldLabel: string;
  }[];

  constructor(patient?: IPatient);

  set(patient: IPatient);

  async get(id: string): Promise<IPatient | IErrorMessage>;

  async create(patientData: IPatient): Promise<IPatient | IErrorMessage>;

  async update(patientData: IPatient): Promise<IPatient | IErrorMessage>;

  async list(): Promise<IPatient[] | IErrorMessage>;
}

export default Patient;
```

### Patient Class Methods

#### `set (patient: IPatient)`

Set patient data from the provided patient object.

#### `get (id: string)`

Fetch patient data by ID from the server and set it in the Patient instance.

#### `create (patientData: IPatient)`

Create a new patient record on the server with the provided patientData and set it in the Patient instance.

#### `update (patientData: IPatient)`

Update patient data on the server with the provided patientData.

#### `delete (patientId: string)`

Delete patient data on the server with the provided patientId.

#### `list ()`

Fetch a list of all patients from the server and return an array of patient data.

## TODO

### Features

- Permission based auth to only view patients that would be specific to the user if applicable. Depending on the application if it's used for a clinic as a whole or many independent clinics it would need to be set up accordingly.
