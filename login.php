<?php
session_start();
error_reporting(E_ALL); //E_ALL
$wb_id = '1093396876';
$wb_key = 'd126f1302a7f1b7e36536f4ad84622a0';
require '../comm/php/saetv2.ex.class.php';
require '../x/mysql.class.php';
if(isset($_GET['code'])){
	$o = new SaeTOAuthV2($wb_id, $wb_key);
	$user = array();
	try {
		$user['token'] = $o->getAccessToken('code', array('code' => $_GET['code'],'redirect_uri' => 'http://kloli.tk/login.php'));
	} catch (OAuthException $e) {
		// header('Location: /p/');
		// print_r($e);
	}
	if(!$user['token'])exit('error.');
	$c = new SaeTClientV2($wb_id, $wb_key, $user['token']['access_token']);
	$u_msg = $c->show_user_by_id($user['token']['uid']);
	$user['id'] = $u_msg['id'];
	$user['information'] = array(
		$u_msg['id'],//'id'=>
		$u_msg['name'],//'name'=>
		$u_msg['description'],//'des'=>
		$u_msg['profile_image_url'],//'avatar'=>
		$u_msg['domain'],//'weibo'=>
		$u_msg['url'],//'website'=>
		$user['token']['access_token']//'access_token'
	);
	$user_ar = $sql->getData('SELECT `uid`,`information` FROM `wb_user` WHERE `uid`=\''.$user['id'].'\'');
	if(!$user_ar[0]){
		$sql->runSql('INSERT INTO wb_user (`unix`,`uid`,`information`) VALUES (\''.time().'\',\''.$user['id'].'\',\''.addslashes(json_encode($user['information'])).'\')');
	}
	$_SESSION['user'] = $user;
	$o_url = $_COOKIE['sty_url'];
	if($o_url){
		unset($_COOKIE['sty_url']);
		header('Location: '.$o_url);
		exit();
	}else{
		header('Location: /p/');
		exit();
	}
}
