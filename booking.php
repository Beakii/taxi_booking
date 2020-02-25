<?php
/*
Author: James Stewart
Student ID: 1391333
*/

    $name = $_POST['name'];
    $phone = $_POST['phone'];
    $street = $_POST['street'];
    $aptNum = $_POST['aptNum'];
    $stNum = $_POST['stNum'];
    $suburb = $_POST['suburb'];
    $destination = $_POST['destination'];
    $timePicker = $_POST['timePicker'];

    require_once ("/home/ysh3325/conf/settings.php");
    $conn = mysqli_connect($host, $user, $pass, $dbnm);

    date_default_timezone_set('NZ');
    $datetime = date("Y-m-d H:i:s", time());

    $sql = "INSERT INTO taxi (clientName, phone, aptNum, stNum, streetName, suburb, pickupTime, destination, currentStatus, bookingTime)
                       VALUES('$name', '$phone', '$aptNum', '$stNum', '$street', '$suburb', '".$timePicker."', '$destination', 'unassigned', '$datetime')";
    
    mysqli_query($conn, $sql);

    $sqlQuery = "SELECT * FROM taxi ORDER BY bookingRef DESC";
    $result = mysqli_query($conn, $sqlQuery);
    $row = mysqli_fetch_row($result);

    $retString = explode("T", $timePicker);

    if($conn){
        mysqli_close();
    }

    echo json_encode(
        array(
            'bookingNum' => $row[0],
            'pickupTime' => $retString[1],
            'pickupDate' => $retString[0]
        )
    );    
?>