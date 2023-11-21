
"use strict";
        
    document.addEventListener('DOMContentLoaded', function() {
        const splashText = document.getElementById('splashText');
        const splashScreen = document.getElementById('splashScreen');
        const header = document.getElementById('main-header');

        const messages = [
            'Welcome to Your Website\n',
            'Discover Exciting Events\n',
            'Explore the Calendar\n',
            'Connect with Us'   
        ];

        let index = 0;

        function updateSplashText() {
            splashText.textContent += messages[index];
            index = (index + 1) % messages.length;
        }

        // Initial update
        updateSplashText();

        const textInterval = setInterval(updateSplashText, 1250);

        // Show header after a certain time 
        setTimeout(function() {
            clearInterval(textInterval);
          
        }, 3750); 
    });
    splashText.style.whiteSpace = 'pre-line';
