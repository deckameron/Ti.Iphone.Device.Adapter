/**
 * DeviceAdapter - Responsive layout manager for iOS
 * Updated for iPhone 17 lineup (2025)
 * Usage: DeviceAdapter.select({ compact: value1, regular: value2, plus: value3, max: value4 })
 */

var DeviceAdapter = (function() {
    
    // Complete iOS device mapping with iPhone 17 lineup
    var DEVICE_SPECS = {
        // Compact (iPhone SE, 8, 7, 6s, 6)
        'compact': {
            heights: [667, 568, 480],
            logicalHeight: 667,
            scale: [2, 3],
            models: ['iPhone SE', 'iPhone 8', 'iPhone 7', 'iPhone 6s', 'iPhone 6']
        },
        // Regular (iPhone 17, 17 Pro, 16, 15, 14, 13, 12, X, XS, 11 Pro)
        'regular': {
            heights: [852, 844, 812],
            logicalHeight: 844,
            scale: [2, 3],
            models: ['iPhone 17', 'iPhone 17 Pro', 'iPhone 16', 'iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone X', 'iPhone XS', 'iPhone 11 Pro']
        },
        // Plus (iPhone 17 Air, Plus models, Pro Max 12-15)
        'plus': {
            heights: [932, 926, 896],
            logicalHeight: 932,
            scale: [3],
            models: ['iPhone 17 Air', 'iPhone 16 Plus', 'iPhone 15 Plus', 'iPhone 14 Plus', 'iPhone 13 Pro Max', 'iPhone 12 Pro Max', 'iPhone 11 Pro Max']
        },
        // Max (iPhone 17 Pro Max, 16 Pro Max)
        'max': {
            heights: [956],
            logicalHeight: 956,
            scale: [3],
            models: ['iPhone 17 Pro Max', 'iPhone 16 Pro Max']
        }
    };
    
    var currentCategory = null;
    var deviceInfo = null;
    
    /**
     * Detects current device category
     */
    function detectDeviceCategory() {
        if (currentCategory) return currentCategory;
        
        var height = Ti.Platform.displayCaps.platformHeight;
        var width = Ti.Platform.displayCaps.platformWidth;
        var dpi = Ti.Platform.displayCaps.dpi;
        
        // Detect by screen height with precise matching
        for (var category in DEVICE_SPECS) {
            var heights = DEVICE_SPECS[category].heights;
            for (var i = 0; i < heights.length; i++) {
                // Allow 15 points tolerance for detection
                if (Math.abs(height - heights[i]) < 15) {
                    currentCategory = category;
                    break;
                }
            }
            if (currentCategory) break;
        }
        
        // Fallback: use height ranges to infer category
        if (!currentCategory) {
            if (height <= 667) {
                currentCategory = 'compact';
            } else if (height <= 852) {
                currentCategory = 'regular';
            } else if (height <= 932) {
                currentCategory = 'plus';
            } else {
                currentCategory = 'max';
            }
        }
        
        deviceInfo = {
            category: currentCategory,
            height: height,
            width: width,
            dpi: dpi,
            isCompact: currentCategory === 'compact',
            isRegular: currentCategory === 'regular',
            isPlus: currentCategory === 'plus',
            isMax: currentCategory === 'max',
            possibleModels: DEVICE_SPECS[currentCategory].models
        };
        
        Ti.API.info('📱 Device detected: ' + currentCategory + ' (height: ' + height + 'pt)');
        Ti.API.debug('Possible models: ' + deviceInfo.possibleModels.join(', '));
        
        return currentCategory;
    }
    
    /**
     * Selects the appropriate value based on device
     * @param {Object} values - Object with values for each category
     * @returns {*} Selected value
     * 
     * Example:
     * var fontSize = DeviceAdapter.select({
     *     compact: 14,
     *     regular: 16,
     *     plus: 18,
     *     max: 20
     * });
     */
    function select(values) {
        var category = detectDeviceCategory();
        
        // Try to return exact category value
        if (values[category] !== undefined) {
            return values[category];
        }
        
        // Fallback chain: try similar categories first
        var fallbackOrder = {
            'compact': ['regular', 'plus', 'max'],
            'regular': ['plus', 'compact', 'max'],
            'plus': ['max', 'regular', 'compact'],
            'max': ['plus', 'regular', 'compact']
        };
        
        var fallbacks = fallbackOrder[category];
        for (var i = 0; i < fallbacks.length; i++) {
            if (values[fallbacks[i]] !== undefined) {
                return values[fallbacks[i]];
            }
        }
        
        // Last resort: return any available value
        for (var key in values) {
            if (values[key] !== undefined) {
                return values[key];
            }
        }
        
        return null;
    }
    
    /**
     * Simplified version: compact vs others only
     */
    function selectSimple(compactValue, defaultValue) {
        var category = detectDeviceCategory();
        return category === 'compact' ? compactValue : defaultValue;
    }
    
    /**
     * Scales a value based on device category
     * @param {Number} baseValue - Base value (for regular device)
     * @param {Number} scaleFactor - Scale factor (default: 1)
     */
    function scale(baseValue, scaleFactor) {
        var category = detectDeviceCategory();
        scaleFactor = scaleFactor || 1;
        
        var multipliers = {
            'compact': 0.85,
            'regular': 1.0,
            'plus': 1.1,
            'max': 1.15
        };
        
        return baseValue * multipliers[category] * scaleFactor;
    }
    
    /**
     * Returns device information including possible models
     */
    function getInfo() {
        detectDeviceCategory();
        return deviceInfo;
    }
    
    /**
     * Checks if device is one of the iPhone 17 series
     */
    function isIPhone17Series() {
        detectDeviceCategory();
        var height = deviceInfo.height;
        // iPhone 17 series heights: 844, 852, 932, 956
        return (Math.abs(height - 844) < 15 || 
                Math.abs(height - 852) < 15 || 
                Math.abs(height - 932) < 15 || 
                Math.abs(height - 956) < 15);
    }
    
    // Public API
    return {
        select: select,
        selectSimple: selectSimple,
        scale: scale,
        getInfo: getInfo,
        isIPhone17Series: isIPhone17Series,
        
        // Shortcuts for quick checks
        isCompact: function() { return detectDeviceCategory() === 'compact'; },
        isRegular: function() { return detectDeviceCategory() === 'regular'; },
        isPlus: function() { return detectDeviceCategory() === 'plus'; },
        isMax: function() { return detectDeviceCategory() === 'max'; }
    };
    
})();

// Export for global use
module.exports = DeviceAdapter;