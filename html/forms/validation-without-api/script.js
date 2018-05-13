var form = document.getElementsByTagName("form")[0];
var email = document.getElementById("mail");

/* The following is a trick to reach the next sibling element node in the DOM
This is dangerous because of the risk of an infinite loop.
In modern browsers, it's better to use element.nextElementSibling */
var error = email;
while ((error = error.nextSibling).nodeType != 1);
/* the Node.nodeType method returns an integer value that represents a type of node (e.g. Element, Text of an Element, Comment, Document, etc). In this case, 1 is an Element node such as <p> or <div>, or Node.ELEMENT_NODE. Still not quite sure what the "while" statement is saying though */
// Node.nextSibling is a read-only property that returns the node immediately following the specified node, or null if the specified node is last in the list.

var emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// The following is for old browsers that don't support the addEventListener method
function addEvent(element, event, callback) {
  var previousEventCallBack = element["on"+event];
  element["on"+event] = function(e) {
    var output = callback(e);

    // A callback that returns "false" stops the callback chain
    // and interrupts the execution of the event callback.
    if(output===false) return false;

    if(typeof previousEventCallBack === "function") {
      output = previousEventCallBack(e);
      if(output === false) return false;
    }
  }
};

/* Now we can rebuild our validation constraint. Because we don't rely on CSS pseudoclasses, we have to explicitly set the valid/invalid class on our email field */
addEvent(window, "load", function() {
  // Here we test if the field is empty (the field is not required)
  // If it's not empty, we check if the content is a well-formed email address
  var test = email.value.length === 0 || emailRegExp.test(email.value);

  email.className = test ? "valid" : "invalid";
});

// This defines what happens when the user types in the field
addEvent(email, "input", function() {
  var test = email.value.length === 0 || emailRegExp.test(email.value);
  if(test) {
    email.className = "valid";
    error.innerHTML = "";
    error.className = "error";
  } else {
    email.className = "invalid";
  }
});

// This defines what happens when the user tries to submit the data
addEvent(form, "submit", function() {
  var test = email.value.length === 0 || emailRegExp.test(email.value);

  if(!test) {
    email.className = "invalid";
    error.innerHTML = "I expect an email, darling!";
    error.className = "error active";

    // Some legacy browsers do not support the event.preventDefault() method
    return false;
  } else {
    email.className = "valid";
    error.innerHTML = "";
    error.className = "error";
  }
});
