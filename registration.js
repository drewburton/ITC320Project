/*
 * @Developer Brock Jones
 */
"use strict";

//Figure out if dark mode is enabled. If not, light mode is enabled.
const dark = (sessionStorage.getItem("darkMode") == "on");

//Array of state codes to be used to validate the state code field
const stateCodeArr = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI",
    "ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT",
    "NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD",
    "TN","TX","UT","VT","VA","WA","WV","WI","WY"];

/**
 * User class to be used to store registered users and their information. 
 */
class User {
    constructor(username, password){
        this.username = username;
        this.password = password;
    }
}

/**
 * Sets the border red for the given HTML element.
 * 
 * @param element The HTML element to set the border red for. 
 */
function setBorderRed(element){
    element.css("border", "red 4px solid");
}

/**
 * Resets the border to the initial color and size for the given HTML element.
 * 
 * @param element The HTML element to reset the border of.
 */
function resetBorder(element){
    if(dark) {
        element.css("border", "3px whitesmoke solid");
    } else {
        element.css("border", "3px black solid");
    }
}

/**
 * Validates a given US state code.
 * 
 * @param stateCode The state code field to validate.
 * @returns true if the state code is valid. False otherwise.
 */
function isStateCode(stateCode) {
    for(let usStateCode of stateCodeArr) {
        if(stateCode == usStateCode) {
            return true;
        }
    }

    return false;
}

//Validates a given date.
//Below code copied from Lab 13 for this class. Not my code.
const isDate = text => {
	if ( ! /^[01]?\d\/[0-3]\d\/\d{4}$/.test(text) ) { return false; }
	
	const index1 = text.indexOf( "/" );
	const index2 = text.indexOf( "/", index1 + 1 );
	const month = parseInt( text.substring( 0, index1 ) );
	const day = parseInt( text.substring( index1 + 1, index2 ) );
	
	if( month < 1 || month > 12 ) { 
		return false; 
	} else {
        switch(month) {
            case 2:
                return (day > 28) ? false : true;
            case 4:
            case 6:
            case 9:
            case 11:
                return (day > 30) ? false : true;
            default:
                return (day > 31) ? false : true;
        }
    }
};
//Above code copied from Lab 13 for this class. Not my code.

/**
 * Validates all form fields that need to be validated for the registration form.
 * 
 * @returns true if all form fields are valid. False otherwise.
 */
function validateForm(){
    let valid = true;

    //Validate Date Field.
    let date = $("#date").val().trim();
    if(date == "") {
        $("#date").next().text("This is a required field.");
        valid = false;
        setBorderRed($("#date"));
    } else if(!isDate(date)) {
        $("#date").next().text("Must be a valid date in the form MM/DD/YYYY in the 1900s or 2000s.");
        valid = false;
        setBorderRed($("#date"));
    } else {
        $("#date").next().text("*");
        resetBorder($("#date"));
    }
    $("#date").val(date);

    //Validate First Name Field.
    let firstName = $("#firstName").val().trim();
    if(firstName == "") {
        $("#firstName").next().text("This is a required field.");
        valid = false;
        setBorderRed($("#firstName"));
    } else {
        $("#firstName").next().text("*");
        resetBorder($("#firstName"));
    }
    $("#firstName").val(firstName);
    
    //Validate Last Name Field.
    let lastName = $("#lastName").val().trim();
    if(lastName == "") {
        $("#lastName").next().text("This is a required field.");
        valid = false;
        setBorderRed($("#lastName"));
    } else {
        $("#lastName").next().text("*");
        resetBorder($("#lastName"));
    }
    $("#lastName").val(lastName);
    
    //Validate Username Field.
    let username = $("#username").val().trim();
    if(username == "") {
        $("#username").next().text("This is a required field.");
        valid = false;
        setBorderRed($("#username"));
    } else if(!username.match(new RegExp("^[a-zA-Z0-9]{8,20}$"))) {
        $("#username").next().text("Must contain only letters and numbers and be 8-20 characters long.");
        valid = false;
        setBorderRed($("#username"));
    } else {
        $("#username").next().text("*");
        resetBorder($("#username"));
    }
    $("#username").val(username);

    //Validate Phone Number Field.
    let phoneNumber = $("#phoneNumber").val().trim();
    if(phoneNumber == "") {
        $("#phoneNumber").next().text("This is a required field.");
        valid = false;
        setBorderRed($("#phoneNumber"));
    } else if(!phoneNumber.match(new RegExp("^[0-9]{3}-[0-9]{3}-[0-9]{4}$"))) {
        $("#phoneNumber").next().text("Must be in format xxx-xxx-xxxx (ex. 999-999-9999).");
        valid = false;
        setBorderRed($("#phoneNumber"));
    } else {
        $("#phoneNumber").next().text("*");
        resetBorder($("#phoneNumber"));
    }
    $("#phoneNumber").val(phoneNumber);

    let password = $("#password").val().trim();
    let confirmPassword = $("#confirmPassword").val().trim();
    //Validate Password Fields.
    if(password == "") {
        $("#password").next().text("This is a required field.");
        valid = false;
        setBorderRed($("#password"));
    } else if(!password.match(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,40}$"))) {
        $("#password").next().text("Must be at least 8 characters long, contain at least 1 uppercase and 1 lowercase letter, 1 number, and 1 special character.");
        valid = false;
        setBorderRed($("#password"));
    } else if(password != confirmPassword) {
        $("#password").next().text("The password fields must match.");
        $("#confirmPassword").next().text("The password fields must match.");
        valid = false;
        setBorderRed($("#password"));
        setBorderRed($("#confirmPassword"));
    } else {
        $("#password").next().text("*");
        resetBorder($("#password"));
        $("#confirmPassword").next().text("*");
        resetBorder($("#confirmPassword"));
    }
    $("#password").val(password);
    $("#confirmPassword").val(confirmPassword);    

    let email = $("#email").val().trim();
    let confirmEmail = $("#confirmEmail").val().trim();
    //Validate Email Fields.
    if(email == "") {
        $("#email").next().text("This is a required field.");
        valid = false;
        setBorderRed($("#email"));
    } else if(email != confirmEmail) {
        $("#email").next().text("The email fields must match.");
        $("#confirmEmail").next().text("The email fields must match.");
        valid = false;
        setBorderRed($("#email"));
        setBorderRed($("#confirmEmail"));
    } else {
        $("#email").next().text("*");
        resetBorder($("#email"));
        $("#confirmEmail").next().text("*");
        resetBorder($("#confirmEmail"));
    }
    $("#email").val(email);
    $("#confirmEmail").val(confirmEmail);

    //Validate State Code Field.
    let stateCode = $("#stateCode").val().trim();
    if(stateCode == "") {
        $("#stateCode").next().text("This is a required field.");
        valid = false;
        setBorderRed($("#stateCode"));
    } else if(!isStateCode(stateCode)) {
        $("#stateCode").next().text("Must be a valid US state code.");
        valid = false;
        setBorderRed($("#stateCode"));
    } else {
        $("#stateCode").next().text("*");
        resetBorder($("#stateCode"));
    }
    $("#stateCode").val(stateCode);

    //Validate Zip Code Field.
    let zipCode = $("#zipCode").val().trim();
    if(zipCode == "") {
        $("#zipCode").next().text("This is a required field.");
        valid = false;
        setBorderRed($("#zipCode"));
    } else if(!zipCode.match(new RegExp("^[0-9]{5}$"))) {
        $("#zipCode").next().text("Must be numerical and 5 digits (ex. 11111).");
        valid = false;
        setBorderRed($("#zipCode"));
    } else {
        $("#zipCode").next().text("*");
        resetBorder($("#zipCode"));
    }
    $("#zipCode").val(zipCode);

    return valid;
}

/**
 * Stores the registration results so that they can be displayed in the confirmation page.
 */
function storeRegistration() {
    let registrationArr = [];
    
    //An array of form field selectors to get values from.
    let selectorArr = ["#date", "#firstName", "#lastName", "#username", "#phoneNumber",
            "#email", "#stateCode", "#zipCode", "input[name='customerType']:checked", "input[name='paymentType']:checked",
            "input[name='student']:checked", "input[name='veteran']:checked", "input[name='senior']:checked"];

    for(let selector of selectorArr) {
        registrationArr[registrationArr.length] = $(selector).val();
    }
    
    sessionStorage.setItem("registrationResults", JSON.stringify(registrationArr));
}

/**
 * Stores the user in local storage with the rest of the stored users so that login functionality works.
 * 
 * @returns false to cancel the form submission event.
 */
function storeUser(){
    //If Form values are valid, store the user.
    if(validateForm()){
        console.log("Form is valid, running storeUser()");
        //List of stored users (empty array for first store)
        let users = JSON.parse(localStorage.getItem("users")) || [];

        let username = $("#username").val().trim();
        let password = $("#password").val().trim();

        let notPresent = true;

        for(let user of users){
            console.log(user.username);
            if(user.username == username) {
                notPresent = false;
                break;
            }
        }

        if(notPresent) {
            let newUser = new User(username, password);

            users[users.length] = newUser;

            localStorage.setItem("users", JSON.stringify(users));

            console.log("Users: " + localStorage.getItem("users"));
            storeRegistration();
            location.href = "confirmation.html";

            return false; //Prevent form submission so that redirect happens.
        } else {
            console.log("This username is already registered");
            $("#username").next().text("This username is already registered.");
            setBorderRed($("#username"));

            return false;
        }
    } else {
        console.log("Preventing form submission");
        return false;
    }
}

/**
 * Set dark or light mode upon page load.
 */
$( document ).ready(function() {
    if(dark) {
        $("body").addClass("dark");
        $("input").addClass("darkInput");
    } else {
        $("body").addClass("light");
        $("#submitButton").css("background-color", "limegreen");
    }
});
