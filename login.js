//Check to see if input matches any of the stored users.
//If valid redirect to page and store username as currentUser.
function loginUser(){
    //Stored array of User objects with attributes username and password
    let storedUsers = JSON.parse(localStorage.getItem("users"));

    let loginUsername = $("#username").val();
    let loginPassword = $("#password").val();

    for(let user of storedUsers){
        console.log(user);
        if(user.username == loginUsername && user.password == loginPassword) {
            sessionStorage.setItem("currentUser", loginUsername);
            console.log(localStorage.getItem("currentUser"));
            return true;
        }
    }

    $("#username").css("border","red 5px solid");
    $("#password").css("border","red 5px solid");
    setTimeout(() => alert("Username or Password is incorrect."), 0);

    //Prevent form from submitting
    console.log("Prevent form from submitting.");
    return false;
}