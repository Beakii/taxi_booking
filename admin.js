/*
Author: James Stewart
Student ID: 1391333
Functions:{
    tableRefresh() - Takes no parameters, sends information to PHP, 
                    redraws table based on updated sql database info.

    drawTable() - Takes 1 parameter, a returned JSON object, 
                  draws a table based on the information returned from the PHP.
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

var form = {
    search: document.getElementById("assignBookRef")
};

var fromSubmitButton = false;

document.getElementById('submit').addEventListener("click", () => {

    var formData = `search=${true}&input=${form.search.value}`;
    console.log(form.search.value);

    xhr.open("POST", "admin.php", true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var retJson = JSON.parse(xhr.responseText);
            fromSubmitButton = true;
            document.getElementById('confirmationText').innerText = ""+retJson.assignConf;
            tableRefresh();
        }
    }
    xhr.send(formData);
});

function tableRefresh(){
    if(fromSubmitButton){
        var formData = `search=${true}&input=${form.search.value}`;
    }
    else{
        var formData = `search=${false}&input=${form.search.value}`;
        fromSubmitButton = false;
    }
    
    xhr.open("POST", "admin.php", true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var retJson = JSON.parse(xhr.responseText);
            console.log(retJson);
            document.getElementById('refreshTime').innerHTML = "Last Refreshed: " + retJson.refreshedTime;
            drawTable(retJson);
        }
    }

    xhr.send(formData);
}

function drawTable(retJson){
    try{
        //Creating table header
        var tableDom = document.getElementById('bookingTable');
        var tHead = document.createElement('thead');
        tHead.classList.add('thead-dark');
        var tr = document.createElement("tr");

        var jsonKeys = [];

        for(x in retJson){
            jsonKeys.push(x);
        }

        while(tableDom.firstChild){
            tableDom.removeChild(tableDom.firstChild);
        }

        for(var i = 0; i < Object.keys(retJson).length -2; i++){
            var th = document.createElement('th');
            th.innerText = jsonKeys[i];
            th.setAttribute("scope", "col");
            tr.appendChild(th);
        }
        tHead.appendChild(tr);
        tableDom.appendChild(tHead);


        var tableBody = document.createElement('tbody');
        tableDom.appendChild(tableBody);

        var loopCounter;

        if(retJson.PickupTime.length == 1){
            loopCounter = retJson.PickupTime.length;
        }
        else{
            loopCounter = retJson.PickupTime.length -1;
        }

        for(var i = 0; i < loopCounter; i++){
            var tableRow = document.createElement('tr');

            var data1 = document.createElement('td');
            var dataText = document.createTextNode(retJson.BookingRefNum[i]);
            data1.appendChild(dataText);
            tableRow.appendChild(data1);

            var data2 = document.createElement('td');
            var dataText2 = document.createTextNode(retJson.CustomerName[i]);
            data2.appendChild(dataText2);
            tableRow.appendChild(data2);

            var data3 = document.createElement('td');
            var dataText3 = document.createTextNode(retJson.PhoneNumber[i]);
            data3.appendChild(dataText3);
            tableRow.appendChild(data3);

            var data4 = document.createElement('td');
            var dataText4 = document.createTextNode(retJson.PickupSuburb[i]);
            data4.appendChild(dataText4);
            tableRow.appendChild(data4);

            var data5 = document.createElement('td');
            var dataText5 = document.createTextNode(retJson.DestinationSuburb[i]);
            data5.appendChild(dataText5);
            tableRow.appendChild(data5);

            var data6 = document.createElement('td');
            var dataText6 = document.createTextNode(retJson.PickupTime[i]);
            data6.appendChild(dataText6);
            tableRow.appendChild(data6);

            tableBody.appendChild(tableRow);
        } 
    }
    catch(e){
        console.log(e);
    }
}