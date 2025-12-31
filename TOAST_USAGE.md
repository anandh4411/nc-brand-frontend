# Toast Usage - Quick Reference

## TL;DR - How to Use Toasts

### Import

```typescript
// Single import for everything
import { toast, showSuccess, showError, showInfo, showWarning } from '@/lib/toast';
```

### Basic Usage

```typescript
// Success
showSuccess('User created successfully!');

// Error
showError('Failed to save changes');

// Info
showInfo('New feature available');

// Warning
showWarning('Your session will expire in 5 minutes');
```

### With Custom Titles

```typescript
toast.success('Welcome!', 'You have successfully logged in');
toast.error('Operation Failed', 'Could not delete the file');
toast.info('Heads up!', 'Maintenance scheduled for tomorrow');
toast.warn('Careful!', 'This action cannot be undone');
```

## Where to Use Toasts

### ✅ In Hooks (Success Messages)

```typescript
// api/hooks/users/useCreateUser.ts
import { showSuccess } from '@/lib/toast';

export const useCreateUser = () => {
  return useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: () => {
      showSuccess('User created successfully');
    },
    // No need for onError - handled globally!
  });
};
```

### ✅ In Components

```typescript
// features/users/components/UserForm.tsx
import { toast } from '@/lib/toast';

const handleSubmit = async (data) => {
  if (!data.email.includes('@')) {
    toast.warn('Invalid Email', 'Please enter a valid email address');
    return;
  }

  await createUser.mutateAsync(data);
  // Success toast shown automatically from hook
};
```

### ✅ In Utilities

```typescript
// utils/file-upload.ts
import { showError, showSuccess } from '@/lib/toast';

export const uploadFile = async (file: File) => {
  if (file.size > MAX_SIZE) {
    showError('File too large. Maximum size is 5MB');
    return;
  }

  const result = await upload(file);
  showSuccess('File uploaded successfully');
  return result;
};
```

### ✅ In Event Handlers

```typescript
// features/users/components/UserTable.tsx
import { toast } from '@/lib/toast';

const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.info('Copied!', 'Text copied to clipboard');
};

const handleDelete = async (uuid: string) => {
  const confirmed = await showConfirmDialog();
  if (confirmed) {
    await deleteUser.mutateAsync(uuid);
    // Success/error toasts shown automatically
  }
};
```

## When NOT to Use Toasts

### ❌ For Error Handling in API Calls

```typescript
// ❌ DON'T DO THIS - Errors already handled globally
export const useCreateUser = () => {
  return useMutation({
    mutationFn: usersApi.createUser,
    onError: (error) => {
      showError('Failed to create user'); // ❌ Duplicate!
    },
  });
};

// ✅ DO THIS - Let global handler do its job
export const useCreateUser = () => {
  return useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: () => {
      showSuccess('User created successfully'); // ✅ Only success needed
    },
  });
};
```

## Toast Types Reference

| Function | When to Use | Example |
|----------|-------------|---------|
| `showSuccess()` | After successful operations | "User created", "Changes saved" |
| `showError()` | For manual error notifications | "Invalid file type", "Quota exceeded" |
| `showInfo()` | For informational messages | "Copied to clipboard", "Feature enabled" |
| `showWarning()` | For warnings/cautions | "Session expiring", "Unsaved changes" |

## Advanced Examples

### Conditional Toasts

```typescript
const handleSave = async () => {
  const hasChanges = checkForChanges();

  if (!hasChanges) {
    showInfo('No changes to save');
    return;
  }

  await saveChanges();
  showSuccess('Changes saved successfully');
};
```

### With User Confirmation

```typescript
const handleDeleteAll = async () => {
  const count = selectedItems.length;

  if (count === 0) {
    showWarning('No items selected');
    return;
  }

  const confirmed = await confirm(`Delete ${count} items?`);
  if (confirmed) {
    await deleteMany(selectedItems);
    showSuccess(`Deleted ${count} items`);
  }
};
```

### After Async Operations

```typescript
const handleImport = async (file: File) => {
  try {
    const result = await importFile(file);

    if (result.warnings.length > 0) {
      showWarning(
        'Import completed with warnings',
        `${result.warnings.length} items skipped`
      );
    } else {
      showSuccess('Import completed', `${result.imported} items imported`);
    }
  } catch (error) {
    // Error toast shown automatically by global handler
  }
};
```

### Optimistic UI Updates

```typescript
const handleToggleStatus = async (uuid: string) => {
  // Show immediate feedback
  showInfo('Updating status...');

  await updateStatus.mutateAsync(uuid);
  // Success toast shown from hook's onSuccess
};
```

## Remember

1. **Errors are automatic** - Don't add error toasts in hooks
2. **Use helper functions** - `showSuccess()`, `showError()`, etc.
3. **Keep messages short** - Title + optional description
4. **Be consistent** - Use same wording across the app
5. **Don't spam** - Avoid multiple toasts for same action

## Full API

```typescript
// Helper functions (recommended)
showSuccess(message: string, title?: string = "Success")
showError(message: string, title?: string = "Error")
showInfo(message: string, title?: string = "Info")
showWarning(message: string, title?: string = "Warning")

// Direct toaster (more control)
toast.success(title: string, description?: string)
toast.error(title: string, description?: string)
toast.info(title: string, description?: string)
toast.warn(title: string, description?: string)
```

## Examples in Context

### Login Flow

```typescript
// ✅ Good - Success only
const { loginUser } = useLogin();

const handleLogin = async (credentials) => {
  await loginUser(credentials);
  // Success: "Welcome back!" (from hook)
  // Error: "Authentication Required" (from global handler)
};
```

### Form Submission

```typescript
// ✅ Good - Success + validation
const { createUser } = useCreateUser();

const handleSubmit = async (data) => {
  // Client-side validation
  if (!isValidEmail(data.email)) {
    showWarning('Please enter a valid email address');
    return;
  }

  await createUser.mutateAsync(data);
  // Success: "User created successfully" (from hook)
  // Error: "Validation Failed: email: Invalid format" (from global handler)
};
```

### File Operations

```typescript
// ✅ Good - Multiple toasts for different scenarios
const handleUpload = async (files: File[]) => {
  if (files.length === 0) {
    showInfo('Please select files to upload');
    return;
  }

  const oversized = files.filter(f => f.size > MAX_SIZE);
  if (oversized.length > 0) {
    showError(`${oversized.length} files exceed size limit`);
    return;
  }

  await uploadFiles(files);
  showSuccess(`${files.length} files uploaded successfully`);
};
```
