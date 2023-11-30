
"use strict";
document.addEventListener("DOMContentLoaded", function () {
    
    setTimeout(function () {
      var splashScreen = document.querySelector(".splashscreen");
  
      fadeOut(splashScreen);
    }, 4000); 
  
    function fadeOut(element) {
      var opacity = 1;
      var interval = setInterval(function () {
        if (opacity > 0) {
          opacity -= 0.1;
          element.style.opacity = opacity;
        } else {
          clearInterval(interval);
          element.style.display = "none";
          document.body.style.overflow = "auto";
        }
      }, 50); 
    }
  });
    
  document.addEventListener('DOMContentLoaded', function() {
    const splashText = document.getElementById('splashText');
    const splashScreen = document.getElementById('splashScreen');
    const header = document.getElementById('main-header');

    const messages = [
      'Welcome to Your Website<br>',
      'Discover Exciting Events<br>',
      'Explore the Calendar<br>',
      'Connect with Us' 
    ];

    let index = 0;

    function updateSplashText() {
        splashText.innerHTML += messages[index];
        index = (index + 1) % messages.length;
    }

    updateSplashText();
    const textInterval = setInterval(updateSplashText, 1250);
   
    setTimeout(function() {
        clearInterval(textInterval);
    }, 3750);
});
    "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min.js"
   
    // Check if dark mode is stored in session storage on page load
if (sessionStorage.getItem("darkMode") === "on") {
  // If dark mode is stored as "on", apply dark mode
  $("body, header, div").addClass("dark");
  $(".change").text("ON");
} else {
  // Otherwise, apply light mode
  $("body, header, div").removeClass("dark");
  $(".change").text("OFF");
}

// Set up click event handler
$(".change").on("click", function () {
  // Toggle dark mode
  if ($("body").hasClass("dark")) {
      $("body, header, div").removeClass("dark");
      $(".change").text("OFF");
      // Store the state in session storage
      sessionStorage.setItem("darkMode", "off");
  } else {
      $("body, header, div").addClass("dark");
      $(".change").text("ON");
      // Store the state in session storage
      sessionStorage.setItem("darkMode", "on");
  }
});