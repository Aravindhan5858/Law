# Loader System Documentation

## Overview
The Loader system provides a robust, configurable landing page loader with optional auto-redirect functionality.

## Features
- ✅ **No auto-redirect by default** - User must click Continue
- ✅ **Configurable auto-redirect** - Enable via config flag
- ✅ **Prevents duplicate navigation** - Smart navigation handling
- ✅ **Keyboard accessibility** - Enter to continue, ESC to cancel
- ✅ **Responsive design** - 35% desktop / 65% mobile logo sizing
- ✅ **Circular logo** - `border-radius: 50%`
- ✅ **Dark theme** - Matches app design with gold accents
- ✅ **Cleanup on unmount** - Proper timer management

## Configuration

Edit `/frontend/src/config/loaderConfig.ts`:

```typescript
export const loaderConfig = {
  enabled: true,           // Enable/disable loader
  autoRedirect: false,     // Auto-redirect (default: false)
  autoDelay: 5000,         // Auto-redirect delay (ms)
  targetPath: '/home',     // Navigation target
  logoSrc: '/assets/legal_logo.svg',  // Logo path
  buttonDelay: 3000,       // Continue button delay (ms)
};
```

## Usage

### Basic Usage (No Auto-Redirect)
```tsx
<Loader targetPath="/home" />
```

### With Auto-Redirect
```tsx
<Loader 
  targetPath="/home" 
  autoRedirect={true} 
  autoDelay={5000} 
/>
```

### Custom Logo
```tsx
<Loader 
  targetPath="/home" 
  logoSrc="/path/to/custom-logo.png" 
/>
```

## Keyboard Shortcuts
- **Enter** - Navigate to target page (when Continue button is visible)
- **ESC** - Cancel auto-redirect timer

## Component Props

### Loader Component
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `targetPath` | string | required | Navigation destination |
| `autoRedirect` | boolean | `false` | Enable auto-redirect |
| `autoDelay` | number | `5000` | Auto-redirect delay (ms) |
| `logoSrc` | string | `/assets/legal_logo.svg` | Logo image path |
| `buttonDelay` | number | `3000` | Continue button appearance delay |
| `onNavigate` | function | `undefined` | Callback before navigation |

## Context API

The LoaderProvider context allows global loader configuration:

```tsx
import { useLoaderContext } from './context/LoaderContext';

function MyComponent() {
  const { config, setConfig } = useLoaderContext();
  
  // Enable auto-redirect globally
  setConfig({ autoRedirect: true, autoDelay: 3000 });
}
```

## Responsive Breakpoints

```css
Desktop (>768px):  Logo 35% width
Tablet (≤768px):   Logo 50% width
Mobile (≤480px):   Logo 65% width
Small (≤320px):    Logo 70% width
```

## Implementation Details

### Timer Management
- Button timer starts immediately on mount
- Auto-redirect timer only starts if `autoRedirect === true`
- Clicking Continue cancels both timers
- All timers cleared on unmount

### Navigation Safety
- `hasNavigatedRef` prevents duplicate navigation
- Timer cancellation on Continue click
- Proper cleanup on component unmount

### Accessibility
- Focus-visible outline on Continue button
- ARIA labels for screen readers
- Keyboard navigation support

## Customization

### Styling
Edit `/frontend/src/styles/Loader.css` to customize:
- Colors and gradients
- Animation timings
- Responsive breakpoints
- Logo effects

### Auto-Redirect
To enable auto-redirect, update the config:
```typescript
// loaderConfig.ts
export const loaderConfig = {
  autoRedirect: true,  // Enable auto-redirect
  autoDelay: 5000,     // Wait 5 seconds
  // ... other settings
};
```

## Example: Custom Landing Page

```tsx
import Loader from '../components/Loader';

const CustomLanding = () => {
  const handleNavigate = () => {
    console.log('User navigating...');
  };

  return (
    <Loader
      targetPath="/dashboard"
      autoRedirect={false}
      logoSrc="/custom-logo.png"
      onNavigate={handleNavigate}
    />
  );
};
```

## Troubleshooting

### Logo not displaying
- Verify logo path in `loaderConfig.ts`
- Check file exists in `/public/assets/`
- Inspect browser console for 404 errors

### Auto-redirect not working
- Check `autoRedirect: true` in config
- Verify `autoDelay` value is reasonable
- Check browser console for errors

### Continue button not appearing
- Adjust `buttonDelay` in config
- Check component is mounted
- Verify no CSS hiding the button

## Best Practices

1. **Keep auto-redirect disabled by default** - Better UX
2. **Use reasonable delays** - 3-5 seconds for visibility
3. **Provide keyboard navigation** - Accessibility requirement
4. **Test on mobile devices** - Verify responsive behavior
5. **Monitor performance** - Large logos may slow load time

## Migration Guide

### From Old Landing Page
Replace:
```tsx
// Old
<div className="landing-page">
  <LogoDisplay />
  <button onClick={() => navigate('/home')}>Continue</button>
</div>
```

With:
```tsx
// New
<Loader targetPath="/home" />
```

### Enable Auto-Redirect (Optional)
```typescript
// loaderConfig.ts
autoRedirect: true,  // Enable feature
autoDelay: 5000,     // 5 second delay
```
