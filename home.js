"use strict";

/**
 * Execute code after the DOM content has loaded.
 */
document.addEventListener("DOMContentLoaded", function () {

    /**
     * Function to fade out an element gradually.
     * @param {HTMLElement} element - The HTML element to fade out.
     * @param {Function} callback - The callback function to execute after fading out.
     */
    function fadeOut(element, callback) {
        var opacity = 1;

        /**
         * Set an interval to decrease opacity until it reaches 0.
         */
        var interval = setInterval(function () {
            if (opacity > 0) {
                opacity -= 0.1;
                element.style.opacity = opacity;
            } else {
                clearInterval(interval);

                // Hide the element and enable body overflow once faded out
                element.style.display = "none";
                document.body.style.overflow = "auto";

                // Call the callback function after fading out
                callback();
            }
        }, 50);
    }

    /**
     * Function to execute after the splash screen disappears
     */
    function afterSplashScreen() {
        // Get references to HTML elements
        const splashText = document.getElementById('splashText');
        const header = document.getElementById('main-header');

        // Array of messages to display in the splash text
        const messages = [
            'Welcome to Central Alarms<br>',
            'Discover Exciting Events<br>',
            'Explore the Calendar<br>',
            'Connect with Us'
        ];

        let index = 0;

        /**
         * Function to update splash text with messages.
         */
        function updateSplashText() {
            splashText.innerHTML += messages[index];
            index = (index + 1) % messages.length;
        }

        // Initial call to updateSplashText and set interval for subsequent updates
        updateSplashText();
        const textInterval = setInterval(updateSplashText, 1250);

        // Clear the interval after 3.75 seconds
        setTimeout(function () {
            clearInterval(textInterval);
        }, 3750);
    }

    /**
     * Set a timeout to hide the splash screen after 4 seconds.
     */
    setTimeout(function () {
        // Find the splash screen element
        var splashScreen = document.querySelector(".splashscreen");

        // Call the fadeOut function to gradually hide the splash screen
        fadeOut(splashScreen, afterSplashScreen);
    }, 4000);

    // Include jQuery library from a CDN
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min.js";
    document.head.appendChild(script);

    /**
     * Gets the session storage for the color mode and 
     * toggle between night or light mode 
     * whenever the user presses the button.
     */
    if (sessionStorage.getItem("darkMode") === "on") {

        // Apply dark mode styles if dark mode is on
        $("body, header, div").addClass("dark");
        $(".change").text("ON");
    } else {

        // Remove dark mode styles if dark mode is off
        $("body, header, div").removeClass("dark");
        $(".change").text("OFF");
    }

    /**
     * Event listener for the button click to toggle dark mode.
     */
    $(".change").on("click", function () {

        if ($("body").hasClass("dark")) {
            // Toggle off dark mode
            $("body, header, div").removeClass("dark");
            $(".change").text("OFF");
            sessionStorage.setItem("darkMode", "off");
        } else {
            // Toggle on dark mode
            $("body, header, div").addClass("dark");
            $(".change").text("ON");
            sessionStorage.setItem("darkMode", "on");
        }
    });
});
