var $ = function(i) {
	return document.getElementById(i)
},
c = function(p, i) {
	arguments.length == 1 && (i = p) && (p = document);
	return p.getElementsByTagName(i)
},
css = function(a, b) {
	a.style.cssText += (';' + b)
},
ajax = function(i, p, f) {
	var x = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
	x.open(p ? 'POST' : 'GET', i, 1);
	x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	x.send(p || '');
	if (f) {
		x.onreadystatechange = function() {
			if (this.readyState == 4 && ((this.status > 199 && this.status < 301) || this.status == 304)) {
				f(this.responseText)
			}
		}
	}
},
parseJSON = self.JSON ? JSON.parse : function(i) {
	return eval('(' + i + ')')
},
setcookie = function(i, v, s) {
	s = s || 31536000;
	var exp = new Date();
	exp.setTime(exp.getTime() + s * 1000);
	document.cookie = i + '=' + escape(v) + ';expires=' + exp.toGMTString()
},
getcookie = function(i) {
	var arr = document.cookie.match(new RegExp('(^| )' + i + '=([^;]*)(;|$)'));
	return arr == null ? null : unescape(arr[2])
},
pp = {
	load: function() {
		ajax('index.php?user', 0, function(user) {
			if (!user) {
				pp.login();
				document.title = '尚未登录'
			} else {
				pp.box();
				user = parseJSON(user);
				document.title = '欢迎【' + user[1] + '】'
			}
		})
	},
	show: function(i) {
		$('box').innerHTML = '<img src="' + i + '">';
		// console.log('上传成功');
		var img = new Image();
		img.onload = function() {
			pp.train_parent(this.src + '|' + this.width + '|' + this.height)
		};
		img.src = i;
		/*c($('box'), 'img')[0].onload = function() {
		// console.log('载入成功');
			pp.train_parent(this.src + '|' + this.offsetWidth + '|' + this.offsetHeight)
		}*/
	},
	login: function() {
		$('box').className = '';
		$('login').className = 'show'
	},
	box: function() {
		var b = $('box');
		b.className = 'show';
		$('login').className = '';
		css(b, 'line-height:' + b.clientHeight + 'px;')
	},
	train_parent: function(i) {
		console.log(i);
		$('train').innerHTML = '';
		$('train').innerHTML = '<iframe style="display:none;" src="' + location.hash.substring(2) + '#' + i + '"></iframe>'
	}
},
alert = function(i) {
	var msg = document.createElement('p');
	msg.id = 'msg';
	msg.onclick = function() {
		msg.className = ''
	};
	c('body')[0].appendChild(msg);
	return function(i) {
		msg.innerHTML = i;
		msg.className = 'show';
		clearTimeout(this.tot);
		this.tot = setTimeout(function() {
			msg.className = ''
		}, 4000)
	}
};
// 当前是弹出窗口
if (window.opener) {
	window.opener.pp.load();
	window.close()
}
pp.load();
c($('login'), 'a')[0].onclick = function() {
	setcookie('sty_url', location.href);
	window.open(this.href, '_blank', 'resizable=0,scrollbars=0,width=800,height=600');
	return false
};
if (window.XMLHttpRequest && window.FileReader) {
	var _html = c(document, 'html')[0];
	_html.ondragenter = function(e) {
		_html.className = 'drop'
	};
	_html.ondragleave = function(e) {
		_html.className = ''
	};
	_html.ondragover = function(e) {
		e.preventDefault()
	};
	_html.ondrop = function(e) {
		e.preventDefault();
		handleFile(e.dataTransfer.files)
	};
	$('dragF').onchange = function() {
		handleFile(this.files)
	};
	handleFile = function(files) {
		if (files.length == 0) {
			alert('如果拖图像进来我会很高兴哟~');
			return
		} else if(files.length > 1) {
			alert('请不要贪心哟，一次只能识别单个文件QAQ')
		}
		var _i = 0,
		_num = files.length,
		f = function() {
			var file = files[_i];
			if (file.type.indexOf('image') != 0) {
				alert('这不是一个图像或音频！');
				return
			}
			if (!file.size > 2000000) {
				alert('请上传小于2MB大小的图像！');
				return
			}
			$('box').innerHTML = '上传中...';
			var xhr = new XMLHttpRequest();
			if (xhr.upload) {
				xhr.upload.onprogress = function(e) {
					css($('pace'), 'width:' + e.loaded / e.total * 100 + '%');
				};
				// 文件上传成功或是失败
				xhr.onreadystatechange = function(e) {
					if (this.readyState == 4) {
						if (this.responseText.indexOf('sinaimg.cn/large/') != -1) {
							//console.log(this.responseText);
							alert('上传成功！');
							pp.show(this.responseText.replace('large', 'bmiddle'));//
							//this.responseText
							_i++;
							if (_i < _num) {
								alert('上传成功 ' + _i + '/' + _num + ' ！下一张在2秒钟后开始上传。');
								setTimeout(f, 2000)
							} else {
								alert('全部上传完成')
							}
						} else if(this.status == 403) {
							pp.login()
						}else{
							alert('返回了一个意外的内容！你可以在聊天内容里说明情况给鹳狸猿，帮助解决问题！')
						}
						css($('pace'), 'width:0;');
						_html.className = ''
					}
				};
				xhr.open('POST', 'index.php?photo', true);
				xhr.setRequestHeader('X_FILENAME', encodeURIComponent(file.name));
				xhr.send(file)
			}
		};
		f()
	}
};
if (navigator.userAgent.match(/MSIE [5-8]{1}/)) {
	window.location.href = 'http://i.mouto.org/chrome.htm'
}
