<?php
session_start();
error_reporting(E_ALL); //E_ALL
$wb_id = '1093396876';
$wb_key = 'd126f1302a7f1b7e36536f4ad84622a0';
require '../comm/php/saetv2.ex.class.php';
require '../x/mysql.class.php';
$o = new SaeTOAuthV2($wb_id, $wb_key);
if(isset($_GET['login'])){
	$url = $o->getAuthorizeURL('http://kloli.tk/p/login.php');
	header('Location: '.$url);
	exit();
}
if(isset($_GET['user'])){
	if(preg_match('/^[0-9]{8,12}$/', $_GET['user'])){
		$user_ar = $sql->getData('SELECT `information` FROM `wb_user` WHERE `uid`=\''.$_GET['user'].'\'');
		$r = $user_ar[0]['information'];
	}elseif($_GET['user'] == 'all'){
		$user_ar = $sql->getData('SELECT `information` FROM `wb_user`');
		$r = array();
		foreach($user_ar as $user){
			$r[] = json_decode($user['information']);
		}
		$r = json_encode($r);
	}else{
		$user = $_SESSION['user'];
		if(!$user){
			exit();
		}
		$r = json_encode($user['information']);
	}
	if(isset($_GET['callback'])){
		header('Content-type: text/javascript');
		echo $_GET['callback'].'('.$r.')';
	}else{
		header('Content-type: application/json');
		echo $r;
	}
}elseif(isset($_GET['photo'])){
	if(preg_match('/^[0-9]{1,3}$/u', $_GET['page'])){
		$start = (int)$_GET['page'] * 30;
		$limit=' ORDER BY `unix` DESC LIMIT '.$start.',30';
		if($_GET['uid'] != 0 && preg_match('/^[0-9]{8,12}$/u', $_GET['uid'])){
			$pic_ar = $sql->getData('SELECT `uid`,`unix`,`url` FROM `wb_pic` WHERE uid=\''.$_GET['uid'].'\''.$limit);
		}elseif(isset($_GET['hide'])){
			$pic_ar = $sql->getData('SELECT `uid`,`unix`,`url` FROM `wb_pic` WHERE `uid`!=\'5343783203\' AND `uid`!=\'5239877849\' AND `uid`!=\'5572630664\' AND `uid`!=\'1833352550\' AND `uid`!=\'1739660870\' AND `uid`!=\'5423367548\' AND `uid`!=\'5285682106\' AND `uid`!=\'1062038223\' AND `uid`!=\'1367128590\' AND `uid`!=\'1945985553\''.$limit);
		}else{
			$pic_ar = $sql->getData('SELECT `uid`,`unix`,`url` FROM `wb_pic`'.$limit);
		}
		if(isset($_GET['callback'])){
			header('Content-type: text/javascript');
			echo $_GET['callback'].'('.json_encode($pic_ar).')';
		}else{
			header('Content-type: application/json');
			echo json_encode($pic_ar);
		}
	}elseif($_GET['photo'] == 'rand'){
		$pic_ar = $sql->getData('SELECT `unix`,`url`,`uid` FROM `wb_pic` ORDER BY RAND() LIMIT '.rand(0,100).',1');
		if(isset($_GET['callback'])){
			header('Content-type: text/javascript');
			echo $_GET['callback'].'('.json_encode($pic_ar).')';
		}else{
			header('Content-type: application/json');
			echo json_encode($pic_ar);
		}
	}elseif($_GET['photo'] == 'DELETE' && preg_match('/http\:\/\/ww[0-9]\.sinaimg\.cn\/large\/[\w]{22,32}\.(jpg|png|jpeg|gif)/is', $_GET['d'])){
		$user = $_SESSION['user'];
		if(!$user){
			header('HTTP/1.0 403 Forbidden');
			exit();
		}elseif($user['id'] == '1687199364'){
			echo $sql->runSql('DELETE FROM `wb_pic` WHERE `url`=\''.$_GET['d'].'\'');
		}else{
			echo $sql->runSql('DELETE FROM `wb_pic` WHERE `url`=\''.$_GET['d'].'\' AND `uid`=\''.$user['id'].'\'');
		}
	}else{
		$user = $_SESSION['user'];
		if(!$user){
			header('HTTP/1.0 403 Forbidden');
			exit();
		}
		$c = new SaeTClientV2($wb_id, $wb_key, $user['token']['access_token']);
		$msg = $c->upload('我刚刚上传了一张照片'.time(), 'php://input');
		if($msg['original_pic']){
			$sql->runSql('INSERT INTO wb_pic (`uid`,`url`,`unix`) VALUES (\''.$user['id'].'\',\''.$msg['original_pic'].'\',\''.time().'\')');
			echo $msg['original_pic'];
			$c->delete($msg['id']);
		}else{
			print_r($msg);
		}
	}
}elseif(isset($_GET['img'])){
	$page = preg_match('/^[0-9]{1,3}$/u', $_GET['page']) ? $_GET['page'] : 0;
	$start = (int)$page * 30;
	$limit = ' ORDER BY unix DESC LIMIT '.$start.',30';
	header('Content-type: application/json');
	echo json_encode($s->runSql('SELECT * FROM `img` LIMIT ORDER BY `unix` DESC LIMIT '.$start.',30'));
}elseif(isset($_GET['addVsco'])){
	if(preg_match('/^[\w]{16,32}$/u', $_GET['addVsco'])){
		$sql->runSql('INSERT INTO wb_pic (`uid`,`url`,`unix) VALUES (\'10000000\',\''.$_GET['addVsco'].'\',\''.time().'\')');
	}else{

	}
}