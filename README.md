# UniBot Frontend

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js Version](https://img.shields.io/badge/next.js-15.3.1-brightgreen)
![React Version](https://img.shields.io/badge/react-19.0.0-brightgreen)

A modern Next.js application that combines the component library of Material UI with the utility-first CSS framework Tailwind CSS.

## 🚀 Features

- **Next.js 15** with App Router and TypeScript
- **Material UI 7** for high-quality React components
- **Tailwind CSS 4** for efficient styling and customization
- **React Hook Form** for easy form validation and submission
- **Custom API integration** with useMutateApi hook

## 📋 Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Development](#development)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Form Handling](#form-handling)
- [Example Pages](#example-pages)
- [Best Practices](#best-practices)
- [Branching Strategy](#branching-strategy)
- [Backend Integration](#backend-integration)

## 📋 Requirements

- **Node.js** (v16.0.0 or higher recommended)
- **Git** for version control
- **npm** or **yarn** package manager

## 🔧 Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone <repo-url>
cd unibot-frontend

# Install dependencies
npm install
# or with yarn
yarn install
```

## 💻 Development

Start the development server with:

```bash
npm run dev
```

This will start the Next.js development server with TurboPack enabled. The application will be available at `http://localhost:3000`.

### Available Scripts

| Command         | Description                                         |
| --------------- | --------------------------------------------------- |
| `npm run dev`   | Start the development server with TurboPack enabled |
| `npm run build` | Build the application for production                |
| `npm run start` | Start the production server (run after build)       |
| `npm run lint`  | Run ESLint to check for code quality issues         |

## 📂 Project Structure

```
unibot-frontend/
├── public/                 # Static assets
├── src/                    # Source code
│   ├── app/                # Next.js app router
│   │   ├── (ui-kit)/       # UI Kit examples
│   │   │   ├── colors-mui-components/ # Color system showcase
│   │   │   └── form-usage/ # Form examples with react-hook-form
│   │   └── ...            # Other routes
│   ├── Core/               # Core application code
│   │   ├── Constant/       # Application constants
│   │   ├── Enums/          # TypeScript enums
│   │   ├── Helpers/        # Helper functions
│   │   └── Models/         # TypeScript interfaces and types
│   ├── Hooks/              # Custom hooks including useMutateApi
│   ├── Style/              # Global styles and Tailwind configuration
│   ├── UI/                 # Reusable UI components
│   └── Utils/              # Utility functions
├── .env                    # Environment variables
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies
├── postcss.config.mjs      # PostCSS configuration for Tailwind
└── tsconfig.json           # TypeScript configuration
```

## 🎨 Design System

This project uses a hybrid approach to styling:

- **MUI Components**: Buttons, select boxes, tables, and other UI components
- **Tailwind CSS**: Layout (flexbox, grid), spacing, colors, and custom styling of MUI components

The design system includes predefined color scales for:

- Primary colors (50-900)
- Secondary colors (50-900)
- Gray shades (50-900)
- Semantic colors (error, warning, info, success)

### Example Usage

```jsx
{
  /* MUI Component with Tailwind styling */
}
;<Button
  variant="contained"
  color="primary"
  className="shadow-sm hover:shadow-md"
>
  Submit
</Button>

{
  /* Tailwind styled element */
}
;<div className="flex flex-col gap-4 p-6 bg-gray-50 rounded-lg">
  <h2 className="text-primary-700 text-xl font-medium">Title</h2>
</div>
```

See the example page at `(ui-kit)/colors-mui-components` for a comprehensive showcase of the color system and component styling.

## 📝 Form Handling

Forms in this project use:

1. **React Hook Form** for state management and validation
2. **MUI Form Elements** for the UI components
3. **Controller** component from react-hook-form to connect MUI inputs
4. **useMutateApi** custom hook for API interactions

### Form Pattern

```jsx
// 1. Define form type
type TExampleForm = {
  fieldName: string,
  // other fields...
};

// 2. Create form with useForm
const { control, handleSubmit, formState: { errors } } = useForm({
  defaultValues: initialValues
});

// 3. Use the useMutateApi hook
const [submitApi, submitApiLoading] = useMutateApi({
  apiPath: '/endpoint',
  method: 'POST',
});

// 4. Handle submission
const onSubmit = async (data: TExampleForm) => {
  const response = await submitApi(data);
  // Handle response...
};

// 5. Render form with Controller components
<form onSubmit={handleSubmit(onSubmit)}>
  <Controller
    name="fieldName"
    control={control}
    rules={{ required: "Field is required" }}
    render={({ field }) => (
      <TextField
        {...field}
        label="Field Label"
        error={!!errors.fieldName}
        helperText={errors.fieldName?.message}
      />
    )}
  />
  <Button type="submit">Submit</Button>
</form>
```

See the example at `(ui-kit)/form-usage` for a complete registration form implementation.

## 📄 Example Pages

### 1. Color System & MUI Components (`(ui-kit)/colors-mui-components`)

This page showcases:

- Color shade systems (primary, secondary, gray, semantic colors)
- MUI components with Tailwind styling
- Button variations
- Text styling
- Card examples
- Form controls integration

### 2. Form Usage (`(ui-kit)/form-usage`)

This page demonstrates:

- A complete registration form implementation
- Form validation with react-hook-form
- MUI form components with Tailwind styling
- Error handling and feedback
- Password visibility toggle
- Form submission to the backend

## 🌟 Best Practices

1. **Component Selection**:

   - Use MUI for interactive components (buttons, inputs, etc.)
   - Use Tailwind for layout and styling

2. **Styling Approach**:

   - Apply Tailwind classes directly to MUI components via `className` prop
   - Use MUI's theme for global styling definitions
   - Override MUI styles when necessary using Tailwind

3. **Form Implementation**:

   - Always use react-hook-form for form state and validation
   - Wrap MUI inputs with Controller component
   - Implement field-level validation rules
   - Use the useMutateApi hook for form submission

4. **Project Organization**:
   - Create reusable components
   - Separate business logic using custom hooks
   - Follow the Next.js App Router structure
   - Use TypeScript for type safety

## 🌿 Branching Strategy

We follow a structured branching workflow to maintain code quality:

- **main**: Production-ready code only
- **feature/task-name**: For new features
- **bugfix/task-name**: For bug fixes

### Guidelines

- ❌ No direct pushes to `main` branch
- ✅ Create branches named after Trello tasks (e.g., `feature/UNI-123-user-authentication`)
- ⚠️ Always pull the latest changes before starting work:
  ```bash
  git checkout main
  git pull
  git checkout -b feature/your-feature
  ```

## 🔄 Backend Integration

This frontend application is designed to work with the UniBot Backend. The integration is handled through:

- **useMutateApi** custom hook for API communication
- Environment variables for API endpoints
- Consistent data models between frontend and backend

For more information about the backend, please refer to the [UniBot Backend](link-to-backend-repo) repository.

## 📦 Dependencies

Major dependencies include:

- Next.js 15.3.1
- React 19.0.0
- Material UI 7.0.2
- Tailwind CSS 4
- React Hook Form 7.55.0
- Axios 1.8.4

For the complete list, see the package.json file.
