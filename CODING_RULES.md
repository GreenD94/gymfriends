# Coding Rules and Standards

This document outlines the coding rules and standards for this project. Follow these rules when writing or modifying code.

## General Rules

### 1. Avoid Null and Undefined

**Rule**: Never use `null` or `undefined` as default values. Instead, use empty values that match the type.

**Bad Example:**
```typescript
const [error, setError] = useState<string | null>(null);
const [name, setName] = useState<string | undefined>(undefined);
```

**Good Example:**
```typescript
const [error, setError] = useState<string>('');
const [name, setName] = useState<string>('');
```

**Rationale**: 
- Simplifies type checking (no need for `string | null`)
- Reduces null/undefined checks throughout the code
- Empty strings are falsy, so `if (error)` still works
- More predictable and easier to reason about

**Implementation**:
- For strings: use empty string `''`
- For arrays: use empty array `[]`
- For objects: use empty object `{}` (if appropriate)
- For numbers: use `0` (if appropriate) or consider if the value should be optional

**Constants Location**:
- If the empty value is specific to a feature module, place it in that feature's constants folder
- If the empty value is a general pattern used across features, place it in `features/core/constants/`
- Example: `emptyError` for auth errors → `features/auth/constants/auth.constants.ts`
- Example: General empty string pattern → `features/core/constants/empty-values.constants.ts`

### 2. File Naming Convention

**Rule**: All files must follow the pattern: `feature-name.file-type.tsx`

**Examples**:
- `login.container.tsx` (in auth feature)
- `order-detail.container.tsx` (in orders feature)
- `user-table.component.tsx` (in users feature)

### 3. Folder Naming Convention

**Rule**: All folders must be plural

**Examples**:
- `features/auth/containers/` ✅
- `features/orders/components/` ✅
- `features/users/hooks/` ✅
- `feature/auth/container/` ❌ (singular)

### 4. Server Actions Location

**Rule**: All server actions must be in `features/core/server-actions/[entity]/[entity]-actions.ts`

**Pattern**: All server actions follow CRUD pattern (create, read, update, delete, list)

**Examples**:
- `features/core/server-actions/users/users-actions.ts`
- `features/core/server-actions/subscriptions/subscriptions-actions.ts`

### 5. Vertical Slicing Architecture

**Rule**: Each feature module should be self-contained with its own:
- `containers/` - Page containers/views
- `components/` - Feature-specific components
- `hooks/` - Feature-specific hooks
- `types/` - Feature-specific types
- `constants/` - Feature-specific constants
- `styles/` - Feature-specific styles (if needed)

### 6. Route Groups

**Rule**: Use Next.js route groups to separate mini-apps:
- `(customers)/` - Customer routes
- `(trainers)/` - Trainer routes  
- `(admins)/` - Admin routes

### 7. Type Safety

**Rule**: Always use TypeScript types. Avoid `any` when possible.

**Bad Example:**
```typescript
function processData(data: any) { ... }
```

**Good Example:**
```typescript
function processData(data: UserData) { ... }
```

### 8. Error Handling

**Rule**: Always handle errors gracefully and provide meaningful error messages to users.

**Pattern**: Use empty string for error state, check with `if (error)` before displaying.

### 9. Async Operations and Loading States

**Rule**: Use React Query (TanStack Query) for all async operations instead of manual `useState` for loading states.

**Bad Example:**
```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string>('');

const handleSubmit = async () => {
  setIsLoading(true);
  setError('');
  try {
    await someAsyncOperation();
  } catch (err) {
    setError('Error message');
  } finally {
    setIsLoading(false);
  }
};
```

**Good Example - Mutations (for write operations):**
```typescript
import { useMutation } from '@tanstack/react-query';

const mutation = useMutation({
  mutationFn: async (data: FormData) => {
    return await someServerAction(data);
  },
  onSuccess: () => {
    // Handle success (e.g., redirect, show toast, refetch data)
    router.push('/success');
  },
  onError: (error) => {
    // Error is automatically available in mutation.error
  },
});

// Usage:
// mutation.mutate(formData)
// mutation.isPending - loading state
// mutation.error - error object
// mutation.isSuccess - success state
```

**Good Example - Queries (for read operations):**
```typescript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['users', userId],
  queryFn: async () => {
    const result = await getUserAction(userId);
    if (!result.success) throw new Error(result.error);
    return result.user;
  },
  enabled: !!userId, // Only run if userId exists
});
```

**Benefits**:
- Automatic loading state management (`isPending` for mutations, `isLoading` for queries)
- Built-in error handling
- Caching and refetching for queries
- Retry logic
- Optimistic updates support
- Less boilerplate code

**Patterns**:
- **Mutations**: Use `useMutation` for create, update, delete operations
- **Queries**: Use `useQuery` for read operations (data fetching)
- **Query Keys**: Use descriptive, hierarchical keys: `['users', userId]`, `['subscriptions', 'active']`
- **Error Messages**: Extract from `mutation.error?.message` or `query.error?.message`, fallback to empty string

## Feature-Specific Rules

### Authentication
- Empty error state: `''` (empty string)
- Error constants in: `features/auth/constants/auth.constants.ts`

### Server Actions
- All must be marked with `'use server'`
- All must follow CRUD pattern
- All must return `{ success: boolean, ... }` structure

### React Query
- Use `useMutation` for all write operations (create, update, delete, login, etc.)
- Use `useQuery` for all read operations (fetching data)
- Never use `useState` for loading states when async operations are involved
- Query keys should be descriptive and hierarchical
- Always handle errors from `mutation.error` or `query.error`

### Single Entity Retrieval Pattern

**Rule**: When fetching a single entity by ID, use the list action with ID filtering instead of creating separate get actions. This applies to all entities (users, subscriptions, exercises, etc.).

**Rationale**:
- Reduces code duplication
- Maintains consistency across all entities
- Single action handles both list and single entity retrieval
- Easier to maintain and extend

**Bad Example:**
```typescript
// ❌ Separate get action
export async function getUserAction(id: string) {
  // ... fetch single user
}

// ❌ Separate hook
export function useUser(userId: string) {
  return useQuery({
    queryFn: () => getUserAction(userId),
  });
}
```

**Good Example:**
```typescript
// ✅ List action with optional ID filter
export async function listUsersAction(page?: number, limit?: number, userId?: string) {
  const query: Record<string, unknown> = {};
  if (userId) {
    query._id = toObjectId(userId);
  }
  // ... fetch users with query
}

// ✅ Use list action with ID filter
const { users } = useUsersList({ userId: '123' });
const user = users?.[0];
```

**Implementation Pattern**:
1. List actions accept optional ID parameter: `listEntityAction(page?, limit?, entityId?)`
2. When `entityId` is provided, filter query by `_id: toObjectId(entityId)`
3. Hooks use list hooks with ID filter: `useEntityList({ entityId: '123' })`
4. Extract first item from array: `const entity = entities?.[0]`

**Location**: All entity actions in `features/core/server-actions/[entity]/[entity]-actions.ts`

### Role-Based Configuration

**Rule**: All role-based mappings (routes, redirects, URLs) must be centralized in `features/core/config/role.config.ts`. Never hardcode role-to-route mappings in components or middleware.

**Bad Example:**
```typescript
// ❌ Hardcoded in component
const getDefaultRedirect = () => {
  switch (role) {
    case 'admin': return '/admin';
    case 'trainer': return '/trainer';
    default: return '/';
  }
};

// ❌ Hardcoded in middleware
const redirectMap = {
  customer: '/',
  trainer: '/trainer',
  admin: '/admin',
};
```

**Good Example:**
```typescript
// ✅ Use centralized config
import { getDashboardUrl, getLoginUrl, getAllowedRoutes } from '@/features/core/config/role.config';

const dashboardUrl = getDashboardUrl(role);
const loginUrl = getLoginUrl(role);
const allowedRoutes = getAllowedRoutes(role);
```

**Benefits**:
- Single source of truth for all role-based routing
- Easy to update routes in one place
- Consistent across middleware, components, and server actions
- Type-safe with TypeScript

**Location**: `features/core/config/role.config.ts`

### Theme Management

**Rule**: All themes must be centralized in `features/core/themes/`. Never hardcode theme values in components.

**Architecture**:
```
features/core/themes/
├── base/              # Base themes for each role
│   ├── customer.theme.ts
│   ├── trainer.theme.ts
│   ├── admin.theme.ts
│   └── master.theme.ts
├── variants/          # Theme variations (light, dark, halloween, etc.)
│   ├── customer/
│   ├── trainer/
│   └── admin/
├── theme.types.ts     # TypeScript types
├── theme-registry.ts  # Theme resolution logic
├── use-theme.hook.ts  # Hook to use themes
└── theme-provider.tsx # Context provider (optional)
```

**Bad Example:**
```typescript
// ❌ Hardcoded in component
const roleThemes = {
  customer: { bg: 'from-blue-50', primary: 'bg-blue-600' },
  // ...
};
```

**Good Example:**
```typescript
// ✅ Use centralized theme system
import { useTheme } from '@/features/core/themes';

export function MyComponent({ role }: Props) {
  const theme = useTheme(role);
  
  return (
    <div className={theme.classes.bg}>
      <button className={theme.classes.primary}>Click</button>
    </div>
  );
}
```

**Theme Structure**:
- **Base Themes**: One per role (customer, trainer, admin, master) in `base/` folder
- **Variants**: Theme variations (light, dark, halloween) in `variants/[role]/` folder
- **Theme Config**: Includes `colors`, `classes`, `content`, and `cssVariables`

**Usage**:
- Use `useTheme(role, variant?)` hook to get theme configuration
- Access theme properties: `theme.classes.primary`, `theme.content.title`, `theme.colors.primary`
- For dynamic theme switching, wrap components in `<ThemeProvider>`

**Adding New Variants**:
1. Create variant file in `variants/[role]/[variant].theme.ts`
2. Import base theme and extend/override properties
3. Register in `theme-registry.ts`
4. Use with `useTheme(role, 'variant')`

## Future Rules

As we encounter new patterns or requirements, they will be added to this document.

