# Iphone Device Adapter for Titanium SDK


![Titanium](https://img.shields.io/badge/Titanium-9.0+-red.svg) ![Platform](https://img.shields.io/badge/platform-iOS-lightgrey.svg) ![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Maintained](https://img.shields.io/badge/Maintained-Yes-green.svg)

**A simple, powerful responsive layout manager for Titanium SDK iOS apps**

Make your Titanium apps look perfect on every iPhone model with minimal effort.

[Features](#-features) • [Installation](#-installation) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Examples](#-examples)

---

##  Why DeviceAdapter?

Building responsive layouts in Titanium SDK can be challenging with so many iPhone screen sizes. DeviceAdapter simplifies this by:

-  **Smart categorization** - Groups iPhone models into logical size categories
-  **Automatic detection** - Detects device category once and caches it
-  **Flexible API** - Multiple methods to adapt your layouts
-  **Zero dependencies** - Pure JavaScript, no external libraries
-  **Lightweight** - Less than 5KB
-  **iPhone 17 ready** - Supports all models from iPhone 6 to iPhone 17 Pro Max

## 📱 Supported Devices

DeviceAdapter categorizes iPhones into 4 logical groups:

| Category | Screen Height | Models |
|----------|--------------|---------|
| **Compact** | ≤ 667pt | iPhone SE, 8, 7, 6s, 6 |
| **Regular** | 844-852pt | iPhone 17, 17 Pro, 16, 15, 14, 13, 12, X, XS, 11 Pro |
| **Plus** | 926-932pt | iPhone 17 Air, 16 Plus, 15 Plus, 14 Plus, Pro Max (12-15) |
| **Max** | 956pt | iPhone 17 Pro Max, 16 Pro Max |

##  Installation

### Option 1: Direct Download

1. Download `DeviceAdapter.js` from this repository
2. Place it in your project's `lib` folder
3. Require it in your code:
```javascript
var DeviceAdapter = require('/lib/DeviceAdapter');
```

### Option 2: Copy-Paste

Simply copy the `DeviceAdapter.js` code into your project's lib folder.

##  Quick Start
```javascript
var DeviceAdapter = require('/lib/DeviceAdapter');

// Select different values based on device size
var fontSize = DeviceAdapter.select({
    compact: 14,
    regular: 16,
    plus: 18,
    max: 20
});

// Create a responsive button
var button = Ti.UI.createButton({
    title: 'Click Me',
    height: DeviceAdapter.select({
        compact: 44,
        regular: 50,
        plus: 54,
        max: 58
    }),
    width: DeviceAdapter.scale(200),
    font: {
        fontSize: fontSize
    }
});
```

That's it! Your UI now adapts to every iPhone screen size. 🎉

##  Documentation

### Core Methods

#### `select(values)`

Selects the appropriate value based on device category. Includes smart fallback system.
```javascript
var padding = DeviceAdapter.select({
    compact: 10,
    regular: 15,
    plus: 20,
    max: 25
});
```

**Parameters:**
- `values` (Object) - Object with values for each category

**Returns:** The selected value for current device

**Smart Fallback:** If a value is missing, it automatically selects the closest category:
```javascript
// If 'max' is not provided, it will use 'plus' as fallback
var width = DeviceAdapter.select({
    compact: 300,
    regular: 350,
    plus: 400
    // max automatically uses plus value (400)
});
```

---

#### `selectSimple(compactValue, defaultValue)`

Simplified selection for compact vs all other devices.
```javascript
var margin = DeviceAdapter.selectSimple(10, 15);
// Returns 10 on compact devices, 15 on all others
```

**Parameters:**
- `compactValue` - Value for compact devices
- `defaultValue` - Value for all other devices

**Returns:** Selected value

---

#### `scale(baseValue, scaleFactor)`

Scales a value proportionally based on device category.
```javascript
var iconSize = DeviceAdapter.scale(24);
// compact: 20.4, regular: 24, plus: 26.4, max: 27.6
```

**Scale multipliers:**
- Compact: 0.85x
- Regular: 1.0x (base)
- Plus: 1.1x
- Max: 1.15x

**Parameters:**
- `baseValue` (Number) - Base value for regular devices
- `scaleFactor` (Number, optional) - Additional multiplier (default: 1)

**Returns:** Scaled value

---

#### `getInfo()`

Returns detailed information about the current device.
```javascript
var info = DeviceAdapter.getInfo();
console.log(info);
// {
//   category: 'regular',
//   height: 844,
//   width: 390,
//   dpi: 326,
//   isCompact: false,
//   isRegular: true,
//   isPlus: false,
//   isMax: false,
//   possibleModels: ['iPhone 17', 'iPhone 16', ...]
// }
```

**Returns:** Object with device information

---

### Boolean Checks

Quick methods to check device category:
```javascript
if (DeviceAdapter.isCompact()) {
    // Special layout for small screens
}

if (DeviceAdapter.isRegular()) {
    // Layout for standard iPhones
}

if (DeviceAdapter.isPlus()) {
    // Layout for Plus/Air models
}

if (DeviceAdapter.isMax()) {
    // Layout for Pro Max models
}

if (DeviceAdapter.isIPhone17Series()) {
    // Enable features exclusive to iPhone 17 lineup
}
```

##  Examples

### Responsive Card Component
```javascript
function createMovieCard(movie) {
    var card = Ti.UI.createView({
        height: DeviceAdapter.select({
            compact: 140,
            regular: 160,
            plus: 180,
            max: 200
        }),
        backgroundColor: '#fff',
        borderRadius: 12,
        top: 10,
        left: 15,
        right: 15
    });
    
    var poster = Ti.UI.createImageView({
        image: movie.poster,
        left: 15,
        width: DeviceAdapter.scale(100),
        height: Ti.UI.FILL,
        borderRadius: 8
    });
    
    var title = Ti.UI.createLabel({
        text: movie.title,
        left: DeviceAdapter.scale(130),
        right: 15,
        top: 15,
        font: {
            fontSize: DeviceAdapter.select({
                compact: 16,
                regular: 18,
                plus: 20,
                max: 22
            }),
            fontWeight: 'bold'
        }
    });
    
    card.add(poster);
    card.add(title);
    
    return card;
}
```

### Adaptive Grid Layout
```javascript
function createGrid(items) {
    var columns = DeviceAdapter.select({
        compact: 2,
        regular: 3,
        plus: 3,
        max: 4
    });
    
    var spacing = DeviceAdapter.selectSimple(10, 15);
    var itemWidth = (Ti.Platform.displayCaps.platformWidth - (spacing * (columns + 1))) / columns;
    
    // Build your grid with calculated dimensions
}
```

### Responsive Form
```javascript
function createLoginForm() {
    var emailField = Ti.UI.createTextField({
        hintText: 'Email',
        height: DeviceAdapter.select({
            compact: 44,
            regular: 50,
            plus: 54,
            max: 58
        }),
        paddingLeft: DeviceAdapter.scale(15),
        font: {
            fontSize: DeviceAdapter.scale(16)
        }
    });
    
    var submitButton = Ti.UI.createButton({
        title: 'Sign In',
        height: DeviceAdapter.selectSimple(44, 50),
        width: Ti.UI.FILL,
        font: {
            fontSize: DeviceAdapter.scale(16),
            fontWeight: 'bold'
        }
    });
    
    return {
        emailField: emailField,
        submitButton: submitButton
    };
}
```

### Device-Specific Features
```javascript
// Check for latest devices
if (DeviceAdapter.isIPhone17Series()) {
    // Enable ProMotion animations
    // Use latest iOS features
    Ti.API.info('Running on iPhone 17 series!');
}

// Adjust layout based on screen size
if (DeviceAdapter.isCompact()) {
    view.layout = 'vertical';
} else {
    view.layout = 'horizontal';
}
```

### Complete Examples

Check out the [DeviceAdapterExamples.js](./DeviceAdapterExamples.js) file for more comprehensive examples including:
- Responsive window configuration
- Adaptive card layouts
- Grid view implementation
- Button styles
- Bottom tab bar
- Login forms
- Table views
- Modal dialogs
- And more!

##  Best Practices

### 1. Use `select()` for discrete values

Perfect for heights, widths, font sizes, and other specific dimensions:
```javascript
height: DeviceAdapter.select({
    compact: 50,
    regular: 60,
    plus: 65,
    max: 70
})
```

### 2. Use `scale()` for proportional sizing

Best for icons, borders, and elements that should scale smoothly:
```javascript
borderRadius: DeviceAdapter.scale(12),
iconSize: DeviceAdapter.scale(24)
```

### 3. Use `selectSimple()` for binary choices

When you only need compact vs others:
```javascript
maxLines: DeviceAdapter.selectSimple(2, 3),
showDetails: DeviceAdapter.selectSimple(false, true)
```

### 4. Cache device info in performance-critical code
```javascript
var deviceInfo = DeviceAdapter.getInfo();
// Use deviceInfo.category, deviceInfo.isCompact, etc.
```

### 5. Don't over-adapt

Not everything needs to be different on every device. Focus on:
- Touch targets (minimum 44pt)
- Text readability
- Content density
- Visual hierarchy

##  Advanced Usage

### Custom Categories

You can extend the module for specific needs:
```javascript
var DeviceAdapter = require('/lib/DeviceAdapter');

// Create custom selector for your app
function customSelect(values) {
    var info = DeviceAdapter.getInfo();
    
    if (info.height <= 667) {
        return values.small || values.default;
    } else if (info.height >= 926) {
        return values.large || values.default;
    }
    
    return values.default;
}
```

### Debugging

Enable detailed logging:
```javascript
var info = DeviceAdapter.getInfo();
Ti.API.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
Ti.API.info('📱 Device Information');
Ti.API.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
Ti.API.info('Category: ' + info.category);
Ti.API.info('Screen: ' + info.width + 'x' + info.height + ' pt');
Ti.API.info('DPI: ' + info.dpi);
Ti.API.info('Possible Models:');
info.possibleModels.forEach(function(model) {
    Ti.API.info('  - ' + model);
});
Ti.API.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
```

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Keep the code simple and readable
- Add comments for complex logic
- Test on multiple device sizes
- Update documentation for new features


##  Known Issues

None at the moment! If you find a bug, please [open an issue](https://github.com/your-username/device-adapter/issues).

##  Roadmap

- [ ] Add iPad support
- [ ] Create npm package
- [ ] Add TypeScript definitions
- [ ] Create visual device preview tool

##  FAQ

**Q: Does this work on Android?**  
A: No, iOS only.

**Q: What about iPads?**  
A: iPad support is planned for a future release.

**Q: Can I use this with Alloy?**  
A: Yes! Works perfectly with both Classic and Alloy projects.

**Q: What's the performance impact?**  
A: Minimal. Device detection happens once and is cached.

**Q: Do I need to update for new iPhone models?**  
A: The fallback system handles unknown devices automatically, but updates are provided for optimal support.

---