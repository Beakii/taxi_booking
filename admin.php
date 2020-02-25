<?php
/*
Author: James Stewart
Student ID: 1391333
*/

    $search = $_POST["search"];
    $input = $_POST["input"];

    require_once ("/home/ysh3325/conf/settings.php");
    $conn = mysqli_connect($host, $user, $pass, $dbnm);

    if(!isset($bookingRef)){
        $bookingRef = "";
    }

    if(!isset($input)){
        $input = "not a number";
    }

    //Get current date/time and create var for current date/time + 2hours
    date_default_timezone_set('NZ');
    $now = date("Y-m-d H:i:s");
    $new_time = date("Y-m-d H:i:s", strtotime('+2 hours', strtotime($now)));


    //search DB for bookings
    $sql = "SELECT * FROM taxi WHERE currentStatus = 'unassigned' ORDER BY pickupTime ASC";
    $result = mysqli_query($conn, $sql);
    $refNum = array();
    $names = array();
    $phones = array();
    $pickupSub = array();
    $destSub = array();
    $pickUp = array();

    //Append times to array if it will occur within next 2 hours
    while($row = mysqli_fetch_assoc($result)){
        if($row['pickupTime'] >= $now && $row['pickupTime'] <= $new_time){
            array_push($refNum, $row['bookingRef']);
            array_push($names, $row['clientName']);
            array_push($phones, $row['phone']);
            array_push($pickupSub, $row['suburb']);
            array_push($destSub, $row['destination']);
            array_push($pickUp, $row['pickupTime']);  
        } 
    }

    //If the draw table request comes from show button
    if($search == "false"){
        if(sizeof($refNum) == 0){
            array_push($refNum, "No info");
        }

        if(sizeof($names) == 0){
            array_push($names, "No info");
        }

        if(sizeof($phones) == 0){
            array_push($phones, "No info");
        }

        if(sizeof($pickupSub) == 0){
            array_push($pickupSub, "No info");
        }

        if(sizeof($destSub) == 0){
            array_push($destSub, "No info");
        }

        if(sizeof($pickUp) == 0){
            array_push($pickUp, "No info");
        }
    }
    //if the draw table request comes from assign taxi button
    else{
        $confirmation = "Nothing has happened";
        $sql = "select * from taxi where bookingRef = '$input'";
        $result = mysqli_query($conn, $sql);

        if(mysqli_num_rows($result) == 1){
            $sql = "select bookingRef from taxi where bookingRef = '$input' and currentStatus = 'unassigned'";
            $result = mysqli_query($conn, $sql);

            if(mysqli_num_rows($result)){
                $confirmation = "The booking request ". $input ." has been properly assigned";
                $sql = "UPDATE taxi SET currentStatus = 'assigned' WHERE bookingRef LIKE '%$input%'";
                $result = mysqli_query($conn, $sql);
            }
            else{
                $confirmation = "The booking request ". $input ." is already assigned";
            }
        }
    }

    echo json_encode(
        array(
            'BookingRefNum' => $refNum,
            'CustomerName' => $names,
            'PhoneNumber' => $phones,
            'PickupSuburb' => $pickupSub,
            'DestinationSuburb' => $destSub, 
            'PickupTime' => $pickUp,
            'refreshedTime' => $now,
            'assignConf' => $confirmation,
        )
    );
?>