/**
 * DeviceAdapter Usage Examples
 * Practical examples for responsive layout design
 */

var DeviceAdapter = require('/lib/DeviceAdapter');

// =============================================================================
// EXAMPLE 1: Basic Window Configuration
// =============================================================================

function createResponsiveWindow() {
    var win = Ti.UI.createWindow({
        backgroundColor: '#fff',
        title: 'Responsive Layout'
    });
    
    // Header with adaptive height
    var header = Ti.UI.createView({
        top: 0,
        height: DeviceAdapter.select({
            compact: 50,
            regular: 60,
            plus: 65,
            max: 70
        }),
        backgroundColor: '#3498db'
    });
    
    // Title with adaptive font size
    var title = Ti.UI.createLabel({
        text: 'My App',
        color: '#fff',
        font: {
            fontSize: DeviceAdapter.select({
                compact: 18,
                regular: 20,
                plus: 22,
                max: 24
            }),
            fontWeight: 'bold'
        }
    });
    
    header.add(title);
    win.add(header);
    
    return win;
}

// =============================================================================
// EXAMPLE 2: Adaptive Card Layout
// =============================================================================

function createMovieCard(movie) {
    var cardHeight = DeviceAdapter.select({
        compact: 140,
        regular: 160,
        plus: 180,
        max: 200
    });
    
    var card = Ti.UI.createView({
        height: cardHeight,
        backgroundColor: '#fff',
        borderRadius: 12,
        top: 10,
        left: 15,
        right: 15,
        // Shadow configuration
        viewShadowColor: '#000',
        viewShadowOffset: { x: 0, y: 2 },
        viewShadowRadius: DeviceAdapter.isCompact() ? 4 : 6,
        viewShadowOpacity: 0.1
    });
    
    // Movie poster
    var posterWidth = DeviceAdapter.scale(100);
    var poster = Ti.UI.createImageView({
        image: movie.poster,
        left: 15,
        width: posterWidth,
        height: cardHeight - 30,
        borderRadius: 8
    });
    
    // Content container
    var contentLeft = posterWidth + 30;
    var content = Ti.UI.createView({
        left: contentLeft,
        right: 15,
        height: Ti.UI.FILL
    });
    
    // Title with adaptive font
    var titleLabel = Ti.UI.createLabel({
        text: movie.title,
        top: 15,
        left: 0,
        right: 0,
        font: {
            fontSize: DeviceAdapter.select({
                compact: 16,
                regular: 18,
                plus: 20,
                max: 22
            }),
            fontWeight: 'bold'
        },
        color: '#2c3e50'
    });
    
    // Description with adaptive sizing
    var description = Ti.UI.createLabel({
        text: movie.description,
        top: DeviceAdapter.selectSimple(45, 50),
        left: 0,
        right: 0,
        font: {
            fontSize: DeviceAdapter.scale(14)
        },
        color: '#7f8c8d',
        ellipsize: true,
        maxLines: DeviceAdapter.isCompact() ? 2 : 3
    });
    
    // Rating badge
    var badge = Ti.UI.createView({
        bottom: 15,
        left: 0,
        width: DeviceAdapter.scale(60),
        height: DeviceAdapter.scale(30),
        backgroundColor: '#f39c12',
        borderRadius: DeviceAdapter.scale(15)
    });
    
    var ratingLabel = Ti.UI.createLabel({
        text: '⭐ ' + movie.rating,
        color: '#fff',
        font: {
            fontSize: DeviceAdapter.scale(12),
            fontWeight: 'bold'
        }
    });
    
    badge.add(ratingLabel);
    content.add(titleLabel);
    content.add(description);
    content.add(badge);
    card.add(poster);
    card.add(content);
    
    return card;
}

// =============================================================================
// EXAMPLE 3: Adaptive Grid Layout
// =============================================================================

function createGridView(items) {
    var scrollView = Ti.UI.createScrollView({
        layout: 'vertical',
        scrollType: 'vertical',
        showVerticalScrollIndicator: true
    });
    
    // Calculate columns based on device
    var columns = DeviceAdapter.select({
        compact: 2,
        regular: 3,
        plus: 3,
        max: 4
    });
    
    var spacing = DeviceAdapter.selectSimple(10, 15);
    var availableWidth = Ti.Platform.displayCaps.platformWidth - (spacing * (columns + 1));
    var itemWidth = availableWidth / columns;
    
    var row = null;
    var itemsInRow = 0;
    
    items.forEach(function(item, index) {
        // Create new row when needed
        if (itemsInRow === 0) {
            row = Ti.UI.createView({
                top: spacing,
                left: spacing,
                right: spacing,
                height: itemWidth + 50,
                layout: 'horizontal'
            });
            scrollView.add(row);
        }
        
        // Create grid item
        var gridItem = Ti.UI.createView({
            width: itemWidth,
            height: itemWidth + 50,
            left: itemsInRow > 0 ? spacing : 0
        });
        
        var thumbnail = Ti.UI.createImageView({
            image: item.image,
            width: itemWidth,
            height: itemWidth,
            borderRadius: 8
        });
        
        var label = Ti.UI.createLabel({
            text: item.title,
            bottom: 5,
            font: {
                fontSize: DeviceAdapter.scale(12)
            },
            textAlign: 'center',
            ellipsize: true,
            wordWrap: false
        });
        
        gridItem.add(thumbnail);
        gridItem.add(label);
        row.add(gridItem);
        
        itemsInRow++;
        if (itemsInRow === columns) {
            itemsInRow = 0;
        }
    });
    
    return scrollView;
}

// =============================================================================
// EXAMPLE 4: Adaptive Button Styles
// =============================================================================

function createButton(config) {
    var button = Ti.UI.createButton({
        title: config.title || 'Button',
        backgroundColor: config.backgroundColor || '#3498db',
        color: '#fff',
        // Adaptive sizing
        height: DeviceAdapter.select({
            compact: 44,
            regular: 50,
            plus: 54,
            max: 58
        }),
        width: config.fullWidth ? Ti.UI.FILL : DeviceAdapter.scale(200),
        borderRadius: DeviceAdapter.scale(25),
        font: {
            fontSize: DeviceAdapter.select({
                compact: 14,
                regular: 16,
                plus: 17,
                max: 18
            }),
            fontWeight: 'bold'
        },
        // Adaptive margins
        top: DeviceAdapter.selectSimple(10, 15),
        left: DeviceAdapter.selectSimple(15, 20),
        right: DeviceAdapter.selectSimple(15, 20)
    });
    
    return button;
}

// =============================================================================
// EXAMPLE 5: Adaptive Tab Bar
// =============================================================================

function createBottomTabBar() {
    var tabBar = Ti.UI.createView({
        bottom: 0,
        height: DeviceAdapter.select({
            compact: 60,
            regular: 70,
            plus: 75,
            max: 80
        }),
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0'
    });
    
    var tabs = [
        { label: 'Home' },
        { label: 'Search' },
        { label: 'Favorites' },
        { label: 'Profile' }
    ];
    
    var tabWidth = Ti.Platform.displayCaps.platformWidth / tabs.length;
    
    tabs.forEach(function(tab, index) {
        var tabButton = Ti.UI.createView({
            left: tabWidth * index,
            width: tabWidth,
            height: Ti.UI.FILL
        });
        
        var icon = Ti.UI.createLabel({
            text: tab.icon,
            top: DeviceAdapter.selectSimple(8, 12),
            font: {
                fontSize: DeviceAdapter.scale(24)
            }
        });
        
        var label = Ti.UI.createLabel({
            text: tab.label,
            bottom: DeviceAdapter.selectSimple(8, 10),
            font: {
                fontSize: DeviceAdapter.scale(11)
            },
            color: '#7f8c8d'
        });
        
        tabButton.add(icon);
        tabButton.add(label);
        tabBar.add(tabButton);
    });
    
    return tabBar;
}

// =============================================================================
// EXAMPLE 6: Adaptive Form Layout
// =============================================================================

function createLoginForm() {
    var container = Ti.UI.createView({
        layout: 'vertical',
        top: DeviceAdapter.select({
            compact: 50,
            regular: 80,
            plus: 100,
            max: 120
        }),
        left: DeviceAdapter.selectSimple(20, 40),
        right: DeviceAdapter.selectSimple(20, 40)
    });
    
    // Logo
    var logo = Ti.UI.createImageView({
        image: '/images/logo.png',
        width: DeviceAdapter.scale(120),
        height: DeviceAdapter.scale(120),
        top: 0
    });
    
    // Title
    var title = Ti.UI.createLabel({
        text: 'Welcome Back',
        top: 30,
        font: {
            fontSize: DeviceAdapter.select({
                compact: 24,
                regular: 28,
                plus: 32,
                max: 36
            }),
            fontWeight: 'bold'
        },
        color: '#2c3e50'
    });
    
    // Input field helper
    function createInput(placeholder) {
        return Ti.UI.createTextField({
            hintText: placeholder,
            top: DeviceAdapter.selectSimple(15, 20),
            height: DeviceAdapter.select({
                compact: 44,
                regular: 50,
                plus: 54,
                max: 58
            }),
            width: Ti.UI.FILL,
            backgroundColor: '#f8f9fa',
            borderRadius: DeviceAdapter.scale(10),
            paddingLeft: DeviceAdapter.scale(15),
            paddingRight: DeviceAdapter.scale(15),
            font: {
                fontSize: DeviceAdapter.scale(16)
            }
        });
    }
    
    var emailField = createInput('Email');
    var passwordField = createInput('Password');
    passwordField.passwordMask = true;
    
    var loginButton = createButton({
        title: 'Sign In',
        backgroundColor: '#3498db',
        fullWidth: true
    });
    
    container.add(logo);
    container.add(title);
    container.add(emailField);
    container.add(passwordField);
    container.add(loginButton);
    
    return container;
}

// =============================================================================
// EXAMPLE 7: Device-Specific Adjustments
// =============================================================================

function createDetailView() {
    var win = Ti.UI.createWindow({
        backgroundColor: '#fff'
    });
    
    // Check device info
    var deviceInfo = DeviceAdapter.getInfo();
    Ti.API.info('Running on: ' + deviceInfo.category);
    Ti.API.info('Possible models: ' + deviceInfo.possibleModels.join(', '));
    
    // Adjust layout based on category
    if (DeviceAdapter.isCompact()) {
        // Compact layout for small devices
        win.layout = 'vertical';
    } else {
        // Side-by-side layout for larger devices
        win.layout = 'horizontal';
    }
    
    // Check for iPhone 17 series
    if (DeviceAdapter.isIPhone17Series()) {
        Ti.API.info('Running on iPhone 17 series!');
        // Enable special features for latest devices
    }
    
    return win;
}

// =============================================================================
// EXAMPLE 8: Responsive Table View
// =============================================================================

function createTableView(data) {
    var table = Ti.UI.createTableView({
        data: data.map(function(item) {
            var row = Ti.UI.createTableViewRow({
                height: DeviceAdapter.select({
                    compact: 70,
                    regular: 80,
                    plus: 90,
                    max: 100
                }),
                backgroundColor: '#fff'
            });
            
            var avatar = Ti.UI.createImageView({
                image: item.avatar,
                left: DeviceAdapter.scale(15),
                width: DeviceAdapter.scale(50),
                height: DeviceAdapter.scale(50),
                borderRadius: DeviceAdapter.scale(25)
            });
            
            var nameLabel = Ti.UI.createLabel({
                text: item.name,
                left: DeviceAdapter.scale(80),
                right: DeviceAdapter.scale(15),
                top: DeviceAdapter.selectSimple(12, 15),
                font: {
                    fontSize: DeviceAdapter.scale(16),
                    fontWeight: 'bold'
                },
                color: '#2c3e50'
            });
            
            var messageLabel = Ti.UI.createLabel({
                text: item.message,
                left: DeviceAdapter.scale(80),
                right: DeviceAdapter.scale(15),
                bottom: DeviceAdapter.selectSimple(12, 15),
                font: {
                    fontSize: DeviceAdapter.scale(14)
                },
                color: '#7f8c8d',
                ellipsize: true
            });
            
            row.add(avatar);
            row.add(nameLabel);
            row.add(messageLabel);
            
            return row;
        })
    });
    
    return table;
}

// =============================================================================
// EXAMPLE 9: Adaptive Modal/Dialog
// =============================================================================

function showAdaptiveDialog(options) {
    var overlay = Ti.UI.createView({
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: Ti.UI.FILL,
        height: Ti.UI.FILL
    });
    
    var dialog = Ti.UI.createView({
        width: DeviceAdapter.select({
            compact: Ti.Platform.displayCaps.platformWidth - 40,
            regular: Ti.Platform.displayCaps.platformWidth - 80,
            plus: 400,
            max: 450
        }),
        height: Ti.UI.SIZE,
        backgroundColor: '#fff',
        borderRadius: DeviceAdapter.scale(16)
    });
    
    var contentView = Ti.UI.createView({
        layout: 'vertical',
        top: DeviceAdapter.scale(20),
        bottom: DeviceAdapter.scale(20),
        left: DeviceAdapter.scale(20),
        right: DeviceAdapter.scale(20)
    });
    
    var titleLabel = Ti.UI.createLabel({
        text: options.title,
        font: {
            fontSize: DeviceAdapter.scale(20),
            fontWeight: 'bold'
        },
        color: '#2c3e50'
    });
    
    var messageLabel = Ti.UI.createLabel({
        text: options.message,
        top: 15,
        font: {
            fontSize: DeviceAdapter.scale(16)
        },
        color: '#7f8c8d'
    });
    
    var buttonContainer = Ti.UI.createView({
        layout: 'horizontal',
        top: 25,
        height: Ti.UI.SIZE
    });
    
    var cancelButton = createButton({
        title: 'Cancel',
        backgroundColor: '#95a5a6'
    });
    
    var confirmButton = createButton({
        title: 'Confirm',
        backgroundColor: '#3498db'
    });
    
    buttonContainer.add(cancelButton);
    buttonContainer.add(confirmButton);
    contentView.add(titleLabel);
    contentView.add(messageLabel);
    contentView.add(buttonContainer);
    dialog.add(contentView);
    overlay.add(dialog);
    
    return overlay;
}

// =============================================================================
// EXAMPLE 10: Usage in Real Scenario
// =============================================================================

function exampleUsage() {
    var win = Ti.UI.createWindow({
        backgroundColor: '#f5f5f5'
    });
    
    // Sample movie data
    var movie = {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through dream-sharing technology',
        poster: '/images/inception.jpg',
        rating: 8.8
    };
    
    // Create adaptive card
    var card = createMovieCard(movie);
    win.add(card);
    
    // Add adaptive button
    var watchButton = createButton({
        title: 'Watch Now',
        backgroundColor: '#e74c3c',
        fullWidth: true
    });
    
    watchButton.addEventListener('click', function() {
        var dialog = showAdaptiveDialog({
            title: 'Start Watching?',
            message: 'This will begin streaming ' + movie.title
        });
        win.add(dialog);
    });
    
    win.add(watchButton);
    
    // Log device info for debugging
    Ti.API.info('Device Category: ' + DeviceAdapter.getInfo().category);
    Ti.API.info('Screen Height: ' + DeviceAdapter.getInfo().height);
    
    win.open();
}

// Export examples
module.exports = {
    createResponsiveWindow: createResponsiveWindow,
    createMovieCard: createMovieCard,
    createGridView: createGridView,
    createButton: createButton,
    createBottomTabBar: createBottomTabBar,
    createLoginForm: createLoginForm,
    createDetailView: createDetailView,
    createTableView: createTableView,
    showAdaptiveDialog: showAdaptiveDialog,
    exampleUsage: exampleUsage
};