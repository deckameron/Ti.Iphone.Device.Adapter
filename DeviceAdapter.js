/**
 * DeviceAdapter - Responsive layout manager for iOS
 * Audited and corrected against official Apple specs (Aug 2026)
 * Fixes: iPhone 17/17 Pro height (874, not 844/852), iPhone Air height (912, not 932),
 *        restored legacy Plus-size height (736), added iPhone 17e
 */

var DeviceAdapter = (function() {
    
    var DEVICE_SPECS = {
        // Compact (iPhone SE, 8, 7, 6s, 6)
        'compact': {
            heights: [667, 568, 480],
            logicalHeight: 667,
            scale: [2, 3],
            models: ['iPhone SE', 'iPhone 8', 'iPhone 7', 'iPhone 6s', 'iPhone 6']
        },
        // Regular (includes legacy 5.5" Plus phones at 736 and iPhone 17/17 Pro at 874)
        'regular': {
            heights: [874, 844, 812, 736], // FIXED: added 874 (17/17 Pro), restored 736 (legacy Plus)
            logicalHeight: 844,
            scale: [2, 3],
            models: [
                'iPhone 17', 'iPhone 17 Pro', 'iPhone 17e', // FIXED: correct height + added 17e
                'iPhone 16', 'iPhone 16e', 'iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone 12',
                'iPhone X', 'iPhone XS', 'iPhone 11 Pro',
                'iPhone 8 Plus', 'iPhone 7 Plus', 'iPhone 6s Plus', 'iPhone 6 Plus' // FIXED: restored
            ]
        },
        // Plus (iPhone Air, Plus models, older Pro Max up to 15)
        'plus': {
            heights: [926, 912, 896], // FIXED: 912 for iPhone Air (was wrongly 932)
            logicalHeight: 926,
            scale: [3],
            models: ['iPhone Air', 'iPhone 16 Plus', 'iPhone 15 Plus', 'iPhone 14 Plus', // FIXED: renamed from "iPhone 17 Air"
                      'iPhone 13 Pro Max', 'iPhone 12 Pro Max', 'iPhone 11 Pro Max', 'iPhone XS Max']
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
    
    function detectDeviceCategory() {
        if (currentCategory) return currentCategory;
        
        var height = Ti.Platform.displayCaps.platformHeight;
        var width = Ti.Platform.displayCaps.platformWidth;
        var dpi = Ti.Platform.displayCaps.dpi;
        
        for (var category in DEVICE_SPECS) {
            var heights = DEVICE_SPECS[category].heights;
            for (var i = 0; i < heights.length; i++) {
                if (Math.abs(height - heights[i]) < 15) {
                    currentCategory = category;
                    break;
                }
            }
            if (currentCategory) break;
        }
        
        // Fallback thresholds updated to match corrected boundaries
        if (!currentCategory) {
            if (height <= 667) {
                currentCategory = 'compact';
            } else if (height <= 874) { // FIXED: was 852, missed real iPhone 17 height
                currentCategory = 'regular';
            } else if (height <= 926) { // FIXED: was 932
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
    
    function select(values) {
        var category = detectDeviceCategory();
        
        if (values[category] !== undefined) {
            return values[category];
        }
        
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
        
        for (var key in values) {
            if (values[key] !== undefined) {
                return values[key];
            }
        }
        
        return null;
    }
    
    function selectSimple(compactValue, defaultValue) {
        var category = detectDeviceCategory();
        return category === 'compact' ? compactValue : defaultValue;
    }
    
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
    
    function getInfo() {
        detectDeviceCategory();
        return deviceInfo;
    }
    
    // FIXED: heights now match the real confirmed values (874, 912, 956)
    function isIPhone17Series() {
        detectDeviceCategory();
        var height = deviceInfo.height;
        return (Math.abs(height - 874) < 15 ||  // iPhone 17 / 17 Pro
                Math.abs(height - 912) < 15 ||  // iPhone Air
                Math.abs(height - 956) < 15);   // iPhone 17 Pro Max
    }
    
    return {
        select: select,
        selectSimple: selectSimple,
        scale: scale,
        getInfo: getInfo,
        isIPhone17Series: isIPhone17Series,
        
        isCompact: function() { return detectDeviceCategory() === 'compact'; },
        isRegular: function() { return detectDeviceCategory() === 'regular'; },
        isPlus: function() { return detectDeviceCategory() === 'plus'; },
        isMax: function() { return detectDeviceCategory() === 'max'; }
    };
    
})();

module.exports = DeviceAdapter;