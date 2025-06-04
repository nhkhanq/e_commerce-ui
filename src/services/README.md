# Services

This directory contains all API service modules for the e-commerce application using RTK Query.

## Structure

```
services/
├── auth/           # Authentication services
├── admin/          # Admin panel services
├── orders/         # Order management services
├── payment/        # Payment processing services
├── product/        # Product catalog services
├── location/       # Address/location services
├── user/           # User profile services
├── vouchers/       # Voucher/discount services
├── revenue/        # Revenue analytics services
├── index.ts        # Main exports
└── README.md       # This file
```

## Usage

Import services directly from individual modules:

```typescript
import { useGetProductsQuery } from "@/services/product/productsApi";
import { useLoginMutation } from "@/services/auth/authApi";
```

Or import from the main index file:

```typescript
import { useGetProductsQuery, useLoginMutation } from "@/services";
```

## API Configuration

All services use RTK Query with a common base URL configuration. Auth tokens are automatically attached where needed.

## Error Handling

Services include built-in error handling and response transformation for consistent API responses.
