window.addEventListener("load", function() {
  document.body.classList.remove("no-widget");
  document.body.classList.add("widget");
});


// Function to deactivate a custom widget.
// the select argument refers to the DOM node with the "select" class
function deactivateSelect(select) {
  // check if widget is already inactive
  if(!select.classList.contains("active")) return;

  // get the list of options for the widget, close the list, and then deactivate the widget itself
  var optList = select.querySelector(".optList");
  optList.classList.add("hidden");
  select.classList.remove("active");
}

/* This function will be used each time the user wants to activate or de-activate the widget
two parameters:
select: the DOM node with the "select" class we want to activate
selectList: the list of all the DOM nodes with the "select" class */
function activeSelect(select, selectList) {
  // check if widget is already active
  if(select.classList.contains("active")) return;

  // gotta turn off the active state on all custom widgets.
  // Because the deactivateSelect function fulfills all the requirements of the forEach callback function, we use it direactly without using an intermediate anonymous function
  selectList.forEach(deactivateSelect);

  // turn on active state for this specific widget
  select.classList.add("active");
}

// function for each time the user wants to open/close the list of options
// select parameter == the DOM node with the list to toggle
function toggleOptList(select) {
  // the list is kept from the widget
  var optList = select.querySelector(".optList");
  // change the class of the list to show/hide it
  optList.classList.toggle("hidden");
}


// This function will be used each time we need to highlight an option
// It takes two parameters:
// select : the DOM node with the `select` class containing the option to highlight
// option : the DOM node with the `option` class to highlight
function highlightOption(select, option) {
  // get the list of all options available for the custom select element
  var optionList = select.querySelectorAll(".option");
  // remove the highlight from all options
  optionList.forEach(function(other) {
    other.classList.remove("highlight");
  });

  //highlight the right option
  option.classList.add("highlight");
};




// ======================================================================
/* The next section is for binding all the above functions to their appropriate events
// =======================================================================
*/

// handle the event binding when the document is loaded
window.addEventListener("load", function() {
  var selectList = document.querySelectorAll(".select");

  //initialize each custom widget
  selectList.forEach(function(select) {
    // and the option elements
    var optionList = select.querySelectorAll(".option");

    // Highlight an option every time a user hovers their mouse over it
    optionList.forEach(function(option) {
      option.addEventListener("mouseover", function() {
        // the "select" and "option" variables are closures available in the scope of our function call
        highlightOption(select,option);
      });
    });

    // each time the user clicks on a custom select element
    select.addEventListener("click", function(event) {
      // note: the "select" variable is a closure available in the scope of our function call
      // we toggle the visibility of the list of options
      toggleOptList(select);
    });

    /* Functionality for focusing on the widget whenever a user clicks or tabs */
    select.addEventListener("focus", function(event) {
      /* Note: the "select" and "selectList" variables are closures available in the scope of our function call */
      activeSelect(select, selectList);
    });

    // in case the widget loses focus
    select.addEventListener("blur", function(event) {
      /* select is a closure */
      deactivateSelect(select);
    });
  });
});




// =================================================================================
/* The next section is for updating the widget's value according to the user input. We will use the functionality of the native widget under the hood to keep track of the value and send the data */
// =================================================================================



/* This function updates the displayed value and synchronizes it with the native widget.
Two parameters:
select: the DOM node with the class "select" containing the value to update
index: the index of the value to be selected
*/
function updateValue(select, index) {
  /* We need to get the native widget for the custom widget. In our example, the native widget is a sibling of the custom widget */
  var nativeWidget = select.previousElementSibling;

  // get the value placeholder of our custom widget
  var value = select.querySelector(".value");
  // and the whole list of options
  var optionList = select.querySelectorAll(".option");
  // set the selected index to the index of our choice
  nativeWidget.selectedIndex = index;
  // update the value placeholder accordingly
  value.innerHTML = optionList[index].innerHTML;
  // and highlight the corresponding option of our custom widget
  highlightOption(select, optionList[index]);
};


/* This function returns the current selected index in the native widget
One parameter -- select: the DOM node with the class "select" related to native widget */
function getIndex(select) {
  // need to access the native widget for the given custom widget
  var nativeWidget = select.previousElementSibling;
  return nativeWidget.selectedIndex;
};

/* the Following code binds the native widgets to the custom ones */

// handle event binding when the document is loaded
window.addEventListener("load", function() {
  var selectList = document.querySelectorAll(".select");

  //initialize each custom widget
  selectList.forEach(function (select) {
    var optionList = select.querySelectorAll(".option"),
    selectedIndex = getIndex(select);
    // make custom widget focusable
    select.tabindex = 0;
    // make native widget no longer focusable
    select.previousElementSibling.tabIndex = -1;
    // make sure that the default selected value is correctly displayed
    updateValue(select, selectedIndex);
    // Each time a user clicks an option, we update the value
    optionList.forEach(function(option, index) {
      option.addEventListener("click", function(event) {
        updateValue(select, index);
      });
    });

    // Each time a user uses the keyboard on a focused widget, we update the value
    select.addEventListener("keyup", function(event) {
      var length = optionList.length,
      index = getIndex(select);

      // When user hits the down arrow, go to the next option
      if(event.keyCode === 40 && index < length - 1) { index++; }
      // same for the up arrow
      if(event.keyCode === 38 && index > 0) { index--; }

      updateValue(select, index);
    });
  });
});
