/*
Author: James Stewart
Student ID: 1391333
Functions:{
    validateInputs() - Takes 1 parameter, json object created from 
                       values from HTML form. Validates inputs.

    validateDate() - takes no paramters
                     validates that the date is future or current.
}
*/

var xhr = false;
if (window.XMLHttpRequest)
{
    xhr = new XMLHttpRequest();
}
else if (window.ActiveXObject)
{
    xhr = new ActiveXObject("Microsoft.XMLHTTP");
}

var errors = [];

var form = {
    errors: document.getElementById('errors'),
    name: document.getElementById('userName'),
    phone: document.getElementById('phone'),
    street: document.getElementById('streetName'),
    aptNum: document.getElementById('aptNum'),
    stNum: document.getElementById('stNum'),
    suburb: document.getElementById('inputSuburb'),
    destination: document.getElementById('destSuburb'),
    time: document.getElementById('timePicker'),
    submit: document.getElementById('submit')
};

document.getElementById('submit').addEventListener("click", () => {

    validateInputs(form);

    if(errors.length > 0){
        console.log("errors in log");
    }
    else{
        var formData = `name=${form.name.value}&phone=${form.phone.value}&street=${form.street.value}&aptNum=${form.aptNum.value}&stNum=${form.stNum.value}&suburb=${form.suburb.value}&timePicker=${form.time.value}&destination=${form.destination.value}`;

        xhr.open("POST", "booking.php", true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200) {
                try{
                    var retJson = JSON.parse(xhr.responseText);

                    document.getElementById("return-message").innerText 
                    = "Thank you! Your booking reference number is " + retJson.bookingNum +". You will be picked up in front of your provided address at " + retJson.pickupTime + " on " + retJson.pickupDate;

                }
                catch(e){
                }
            }
        }
    
        xhr.send(formData);
    }

    errors = [];
});

function validateInputs(form){
    if(form.name.value == '' || form.name.value == null){
        errors.push("name must be filled");
    }

    if(form.phone.value == '' || form.phone.value == null){
        errors.push("phone number must be filled");
    }

    if(form.street.value == '' || form.street.value == null){
        errors.push("street name must be filled");
    }

    if(form.stNum.value == '' || form.stNum.value == null){
        errors.push("street num must be filled");
    }

    if(form.suburb.value == 'Choose a Suburb...' || form.suburb.value == null){
        errors.push("Pickup suburb must be filled");
    }

    if(form.destination.value == 'Choose a Suburb...' || form.suburb.value == null){
        errors.push("Destination suburb must be filled");
    }

    if(form.time.value == '' || form.time.value == null){
        errors.push("Time must be filled");
    }

    if(!validateDate()){
        errors.push("date/time is invalid");
    }

    while(form.errors.firstChild) {
        form.errors.removeChild(form.errors.firstChild);
     }

    for(var i = 0; i < errors.length; i++){
        var item = document.createElement("li");
        item.appendChild(document.createTextNode(errors[i]));
        document.getElementById("errors").appendChild(item);
    }
}

function validateDate(){
    datePicked = new Date(form.time.value);
    var today = new Date();

    if(datePicked.getTime() > today.getTime()){
        return true;
    } else{
        return false;
    }
}