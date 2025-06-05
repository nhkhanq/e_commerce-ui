# Types Structure Documentation

This directory contains TypeScript type definitions organized by domain for better maintainability.

## Directory Structure

```
src/types/
├── common/          # Shared types used across domains
│   ├── pagination.ts    # Pagination related interfaces
│   └── index.ts        # Common exports
├── auth/           # Authentication & authorization
│   ├── auth.ts         # Login, register, token types
│   ├── user.ts         # User, role, permission types
│   └── index.ts        # Auth exports
├── product/        # Product & category related
│   ├── product.ts      # Product, category, search types
│   ├── cart.ts         # Shopping cart types
│   └── index.ts        # Product exports
├── order/          # Order management
│   ├── order.ts        # Order request/response types
│   └── index.ts        # Order exports
├── location/       # Geographic data
│   ├── location.ts     # Province, district, ward types
│   └── index.ts        # Location exports
├── admin/          # Admin specific types
│   ├── revenue.ts      # Revenue analytics types
│   └── index.ts        # Admin exports
└── index.ts        # Root exports
```

## Migration from interfaces/

This structure replaces the previous `src/interfaces/` directory which had:

- All types mixed together in a single index.ts file
- Separate files but not properly organized by domain
- Inconsistent naming conventions

## Usage

Import types using domain-specific paths:

```typescript
// Specific domain imports (recommended)
import { Product, Category } from "@/types/product";
import { LoginRequest, AuthResponse } from "@/types/auth";
import { PaginationProps } from "@/types/common";

// Or use the root export for common types
import { Product, LoginRequest, PaginationProps } from "@/types";
```

## Benefits

1. **Better Organization**: Types are grouped by domain/feature
2. **Easier Navigation**: Developers can quickly find relevant types
3. **Reduced Import Confusion**: Clear separation of concerns
4. **Better Maintainability**: Changes to one domain don't affect others
5. **Consistent Naming**: Following TypeScript/React conventions

## Type Naming Conventions

- **Interfaces**: PascalCase (e.g., `ProductRequest`, `UserData`)
- **Type Aliases**: PascalCase (e.g., `PaymentMethod`)
- **Generic Types**: Use descriptive names (e.g., `PaginatedResponse<T>`)
- **API Response Types**: Suffix with `Response` (e.g., `ProductsResponse`)
- **API Request Types**: Suffix with `Request` (e.g., `OrderRequest`)

## Adding New Types

1. Determine the appropriate domain directory
2. Create the type in the domain-specific file
3. Export from the domain's index.ts
4. Update the root index.ts if it's a commonly used type

## Future Improvements

- Consider adding JSDoc comments for complex types
- Add validation schemas using Zod or similar
- Create utility types for common patterns
- Add type guards for runtime validation
