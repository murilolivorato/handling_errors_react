# Handling Errors with React and Laravel

A comprehensive guide to implementing robust error handling between React frontend and Laravel backend applications.

<p align="center">
<br><br>
<img src="https://miro.medium.com/v2/resize:fit:700/1*Kbq9I2yrqWloM7XdrCUEyA.png" alt="Intro" /><br><br>
</p>

More information at -
https://medium.com/@murilolivorato/handling-errors-with-react-and-laravel-616d8a6562e4



## Overview

This project demonstrates how to implement effective error handling in a React + Laravel application, including:
- API error handling
- Form validation errors
- Global error management
- User-friendly error messages
- Error logging and monitoring

## Features

- Centralized error handling
- Form validation error management
- API error interceptors
- Global error state management
- User-friendly error messages
- Error logging
- Toast notifications for errors
- Error boundary implementation

## Prerequisites

### Backend Requirements
- PHP 8.1 or higher
- Composer
- Laravel 10.x
- MySQL or another database system

### Frontend Requirements
- Node.js (v14 or higher)
- React 18.x
- npm or yarn
- Axios for API requests

## Installation

### Backend Setup

1. Clone the Laravel repository:
```bash
git clone <laravel-repository-url>
cd laravel-error-handling
```

2. Install dependencies:
```bash
composer install
```

3. Configure your environment:
```bash
cp .env.example .env
php artisan key:generate
```

4. Run migrations:
```bash
php artisan migrate
```

### Frontend Setup

1. Create a new React application:
```bash
npx create-react-app react-error-handling
cd react-error-handling
```

2. Install required dependencies:
```bash
# API and State Management
npm install axios @reduxjs/toolkit react-redux

# UI Components
npm install react-toastify
npm install @mui/material @emotion/react @emotion/styled

# Form Handling
npm install formik yup
```

## Project Structure

### Backend Structure
app/
├── Exceptions/
│ └── Handler.php
├── Http/
│ ├── Controllers/
│ │ └── Api/
│ │ └── BaseController.php
│ └── Middleware/
│ └── ApiErrorHandler.php
└── Services/
└── ErrorService.php

### Frontend Structure

src/
├── components/
│ ├── ErrorBoundary/
│ │ └── ErrorBoundary.jsx
│ └── common/
│ └── ErrorMessage.jsx
├── services/
│ ├── api.js
│ └── errorHandler.js
├── store/
│ └── errorSlice.js
└── utils/
└── errorUtils.js



## Implementation

### Backend Error Handling

1. **Custom Exception Handler**
```php
// app/Exceptions/Handler.php
namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    public function render($request, Throwable $exception)
    {
        if ($request->expectsJson()) {
            return $this->handleApiException($request, $exception);
        }

        return parent::render($request, $exception);
    }

    protected function handleApiException($request, Throwable $exception)
    {
        $statusCode = $this->getStatusCode($exception);
        
        return response()->json([
            'error' => [
                'message' => $exception->getMessage(),
                'code' => $statusCode,
                'errors' => $this->getErrors($exception)
            ]
        ], $statusCode);
    }
}
```

2. **Base API Controller**
```php
// app/Http/Controllers/Api/BaseController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class BaseController extends Controller
{
    protected function sendError($error, $code = 400)
    {
        return response()->json([
            'success' => false,
            'error' => $error
        ], $code);
    }

    protected function sendResponse($data, $message = 'Success')
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => $message
        ]);
    }
}
```

### Frontend Error Handling

1. **API Service with Error Interceptor**
```javascript
// src/services/api.js
import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    const { response } = error;
    
    if (response) {
      // Handle validation errors
      if (response.status === 422) {
        const errors = response.data.errors;
        Object.keys(errors).forEach(key => {
          toast.error(errors[key][0]);
        });
      }
      
      // Handle other errors
      else {
        toast.error(response.data.message || 'An error occurred');
      }
    } else {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

2. **Error Boundary Component**
```jsx
// src/components/ErrorBoundary/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

3. **Form Error Handling**
```jsx
// src/components/Form/LoginForm.jsx
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import api from '../../services/api';

const LoginForm = () => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Required'),
    password: Yup.string()
      .required('Required')
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await api.post('/login', values);
      dispatch(login(response.data));
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <Field name="email" type="email" />
          {errors.email && touched.email && (
            <div className="error">{errors.email}</div>
          )}
          
          <Field name="password" type="password" />
          {errors.password && touched.password && (
            <div className="error">{errors.password}</div>
          )}
          
          <button type="submit" disabled={isSubmitting}>
            Login
          </button>
        </Form>
      )}
    </Formik>
  );
};
```

## Error Types and Handling

1. **API Errors**
   - Network errors
   - Validation errors
   - Authentication errors
   - Server errors

2. **Form Validation Errors**
   - Client-side validation
   - Server-side validation
   - Field-level errors
   - Form-level errors

3. **Runtime Errors**
   - Component errors
   - State management errors
   - Unexpected errors

## Best Practices

1. **Error Handling**
   - Use consistent error formats
   - Implement proper error logging
   - Provide user-friendly messages
   - Handle all possible error cases

2. **Code Organization**
   - Centralize error handling logic
   - Use error boundaries effectively
   - Implement proper error recovery
   - Maintain clean error messages

3. **User Experience**
   - Show clear error messages
   - Provide recovery options
   - Maintain application state
   - Handle errors gracefully

## Testing

1. **Error Handling Tests**
```javascript
// src/services/__tests__/errorHandler.test.js
import { handleApiError } from '../errorHandler';

describe('Error Handler', () => {
  it('should handle validation errors', () => {
    const error = {
      response: {
        status: 422,
        data: {
          errors: {
            email: ['Invalid email format']
          }
        }
      }
    };
    
    const result = handleApiError(error);
    expect(result).toContain('Invalid email format');
  });
});
```

## 👥 Author

For questions, suggestions, or collaboration:
- **Author**: Murilo Livorato
- **GitHub**: [murilolivorato](https://github.com/murilolivorato)
- **linkedIn**: https://www.linkedin.com/in/murilo-livorato-80985a4a/


## 📸 Screenshots

### Login Page
![Login Page](https://miro.medium.com/v2/resize:fit:1000/1*f5w6KClmOrrYjI2IiTIv4g.png)

### Dashboard
![Dashboard](https://miro.medium.com/v2/resize:fit:700/1*DYtWlbCEhRlTan-y6oc-jg.png)

### Edit Profile
![Edit Profile](https://miro.medium.com/v2/resize:fit:700/1*aoBrZgWF_fGeLyAJA1bpYA.png)

<div align="center">
  <h3>⭐ Star This Repository ⭐</h3>
  <p>Your support helps us improve and maintain this project!</p>
  <a href="https://github.com/murilolivorato/handling_errors_react/stargazers">
    <img src="https://img.shields.io/github/stars/murilolivorato/handling_errors_react?style=social" alt="GitHub Stars">
  </a>
</div>



