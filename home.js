
"use strict";

"https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min.js">
  
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

        updateSplashText();
        const textInterval = setInterval(updateSplashText, 1250);
       
        setTimeout(function() {
            clearInterval(textInterval);
          
        }, 3750); 
    });
    $( ".change" ).on("click", function() {
      if( $( "body" ).hasClass( "dark" )) {
          $( "body" ).removeClass( "dark" );
          $( ".change" ).text( "OFF" );
      } else {
          $( "body" ).addClass( "dark" );
          $( ".change" ).text( "ON" );
      }
  });