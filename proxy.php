<?php
        header('Content-Type: text/plain');
        // create curl resource
        $url = $_POST['url'];
        dpe($url);

    $ch = curl_init();
    //set the url, number of POST vars, POST data
    curl_setopt($ch,CURLOPT_URL,$url);
    curl_setopt($ch,CURLOPT_POST, 1);
    curl_setopt($ch,CURLOPT_POSTFIELDS,$_POST);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    //execute post
    $result = curl_exec($ch);
    //close connection
    curl_close($ch);
?>