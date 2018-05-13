// There are many ways to pick a DOM node; here we get the form itself and the email
// input box, as well as the span element into which we will place the error message.

var form = document.getElementsByTagName("form")[0];
var email = document.getElementById("mail");
var error = document.querySelector(".error");

email.addEventListener("input", function(event) {
  if(email.validity.valid) {
    // if there's a visible error message but a valid entry is made, this will remove the error styling
    error.innerHTML = ""; // Reset if there is no error
    error.className = "error"; // Reset visual state of the message
  }
}, false);

form.addEventListener("submit", function(event) {
  // We check if the email is valid every time a user tries to send the data
  if(!email.validity.valid) {
    error.innerHTML = "I expect an email, darling!";
    error.className = "error active";
    // prevent the form from being sent by canceling the event
    event.preventDefault();
  }
}, false);
