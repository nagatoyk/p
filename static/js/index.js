/*2013-1-7*/
var $ = function(win, $) {
	$.S = function(i) {
		return document.querySelectorAll(i)
	};
	$.c = function(p, i) {
		arguments.length == 1 && (i = p) && ( p = document);
		return p.getElementsByTagName(i)
	};
	$.cl = function(p, c) {
		arguments.length == 1 && (i = p) && (p = document);
		for (var n = ' ', e = p.getElementsByTagName('*'), r = [], i = 0, j; j = e[i]; i++) {
			(n + j.className + n).indexOf(n + c + n) != -1 ? r.push(j): 0
		}
		return r
	};
	$.css = function(p, i) {
		p.style.cssText += (';' + i)
	};
	$.ajax = function(i, p, f, c) {
		var x = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
		if (c) {
			c = setTimeout(function() {
				x.abort()
			}, c * 1000)
		}
		x.open(p ? 'POST' : 'GET', i, 1);
		x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		x.send(p || '');
		if (f) {
			x.onreadystatechange = function() {
				if(this.readyState == 4 && ((this.status > 199 && this.status < 301) || this.status == 304)) {
					var t = this.responseText;
					f(this.responseText);
					if (c) {
						clearTimeout(c)
					}
				}
			}
		}
	};
	$.json = function(i, f) {
		var s = $.D.m('script'),
		t = 'cb' + new Date().valueOf();
		s.src = i.replace(/\{cb\}/, t);
		if (f) {
			win[t] = f
		}
		$.D.a(s)
	};
	$.swf = function(i) {
		return document[i] || $(i)
	};
	$.setcookie = function(i, v, s) {
		s = s || 31536000;
		var exp = new Date();
		exp.setTime(exp.getTime() + s * 1000);
		document.cookie = i + '=' + escape(v) + ';expires=' + exp.toGMTString()
	};
	$.getcookie = function(i) {
		var arr = document.cookie.match(new RegExp('(^| )' + i + '=([^;]*)(;|$)'));
		return arr == null ? null : unescape(arr[2])
	};
	$.D = {
		m: function(i) {
			return document.createElement(i)
		},
		d: function(o) {
			return o.parentNode.removeChild(o)
		},
		a: function(p, i) {
			arguments.length == 1 && (i = p) && (p = document.body);
			return p.appendChild(i)
		},
		b: function(p, i) {
			p.insertBefore(i, p.childNodes[0])
		}
	};
	if (!win.JSON) {
		win.JSON = {
			parse: function(i) {
				return eval('('+i+')')
			},
			stringify: function(o) {
				var arr = [],
				fmt = function(s) {
					if (typeof s == 'object' && s != null) {
						return json2str(s)
					}
					return /^(string|number)$/.test(typeof s) ? '"' + s + '"' : s
				}
				for (var i in o) {
					arr.push('"'+i+'":'+fmt(o[i]))
				}
				return '{' + arr.join(',') + '}'
			}
		}
	};
	$.img = {
		load: function(o) {
			setTimeout(function() {
				o.className = ''
			}, 10)
		}
	};
	$.P = function() {
		var _nowId = 0,
		run = 0,
		url = [],
		P = {
			run: 0,
			popstate: function() {
				if ($.P.run) {
					return
				}
				url = location.hash.substring(2).split('/');
				url[0] = url[0] || 'login';
				url[1] = url[1] || 0;
				url[2] = url[2] || 0;
				if (url[0] == 'photo') {
					if (_nowId > url[2]) {
						$('new').innerHTML = '<span>加载中...</span>'
					} else {
						$('more').innerHTML = '<span>加载中...</span>'
					}
					_nowId = url[2];
					var URL = 'index.php?photo&uid=' + url[1] + '&page=' + url[2] + '&hide=1';
					/*
					if ($('up-btn').className != 'hide') {
						URL = '/index.php?photo&uid=' + url[1] + '&page=' + url[2]
					}
					*/
					$.ajax(URL, 0, function(pArr) {
						pArr = JSON.parse(pArr);
						if (!pArr) {
							$('more').innerHTML = '<span>已是最后</span>';
							return
						}
						for (var i = 0, l = pArr.length, t = ''; i < l; i++) {
							t += '<li><a href="' + pArr[i].url + '" target="_blank"><img src="' + pArr[i].url.replace('large', 'thumb150') + '"></a><i onclick="$.P.del(this)">×</i></li>'
						}
						$('box').innerHTML = '<form id="indexForm"><input class="pic-index" name="i" value="' + _nowId + '"></form><ul>' + t + '</ul>';
						$('indexForm').onsubmit = function() {
							if (this.i.value.match(/[0-9]{1,}/)) {
								location.hash = '#!' + url[0] + '/' + url[1] + '/' + this.i.value
							}
							return false
						};
						if (pArr.length > 29) {
							$('more').innerHTML = '<a href="#!photo/' + url[1] + '/' + (parseInt(url[2]) + 1) + '">下一页</a>'
						} else {
							$('more').innerHTML = '<span>已是最后</span>'
						}
						if (_nowId > 0) {
							$('new').innerHTML = '<a href="#!photo/' + url[1] + '/' + (_nowId - 1) + '">上一页</a>'
						} else {
							$('new').innerHTML = '<span>已是最前</span>'
						}
					})
				} else if (url[0] == 'user') {
					$.ajax('index.php?user=all', 0, function(uArr) {
						uArr = JSON.parse(uArr);
						document.title = '【用户列表】';
						for (var i = 0, l = uArr.length, t = ''; i < l; i++) {
							t += '<li><a href="#!photo/' + uArr[i][0] + '/0"><img src="'+ uArr[i][3].replace('/50/','/180/') + '"></a></li>'
						}
						$('box').innerHTML = '<p class="pic-index">User List</p><ul>' + t + '</ul>';
						$('new').innerHTML = $('more').innerHTML = ''
					})
				} else if (url[0] == 'login') {
					P.login()
				} else if (url[0] == 'up') {
					$('box').innerHTML = '<div id="up"><iframe src="box.html#!https://yuki-yukimax.rhcloud.com/p/train.html" scrolling="no" allowtransparency="true"></iframe><ul id="up-list"></ul></div>';
					$('new').innerHTML = $('more').innerHTML = ''
				}
				if (!window.onpopstate) {
					window.onpopstate = P.popstate
				}
			},
			ad: function() {
				$('ad').className = 'show'
				if (!$('box').innerHTML) {
					location.hash = '#!photo/0/0'
				}
			},
			login: function() {
				$.ajax('index.php?user', 0, function(user) {
					if (!user) {
						$.P.ad();
						return
					}
					var user = JSON.parse(user);
					document.title = '欢迎【' + user[1] + '】';
					location.hash = $('my').href = '#!photo/' + user[0];
					$('my').innerHTML = user[1];
					// add_pic(user[3].replace('/50/', '/180/'), 'http://weibo.com/' + user[0], 1);
					$('ad').className = $('up-btn').className = '';
					// show.pic('/index.php?' + url[0] + '&uid=' + url[1] + '&page=' + url[2]);
				})
			},
			del: function(o) {
				if (!confirm('真的要删除么?')) {
					return
				}
				var u = $.c(o.parentNode, 'img')[0].src.replace('thumb150', 'large');
				$.ajax('index.php?photo=DELETE&d=' + u, 0, function(txt) {
					if (txt == '1') {
						alert('删除完成')
					}
					$.D.d(o.parentNode)
				})
			}
		};
		return P
	} ();
	var DA;
	// 当前是弹出窗口
	if ((DA = window.dialogArguments) && DA.action == 'login') {
		opener.$.P.login();
		close()
	} else {
		setTimeout($.P.popstate, 10);
	}
	$.c($('ad'), 'span')[0].onclick = function() {
		$('ad').className = ''
	};
	$.c($('ad'),'a')[0].onclick = function() {
		$.setcookie('sty_url', location.href);
		window.showModalDialog(this.href, {action: 'login'}, 'resizable=0,scrollbars=0,width=800,height=600');
		return false
	};
	$.train_node = function(i) {
		i = i.split('|');
		if (i[0].match(/sinaimg\.cn/)) {
			// $('media').value = json2str({type: 1, url: i[0], width: i[1], height: i[2]});
			var _li = $.D.m('li');
			_li.innerHTML = '<a href="' + i[0].replace(/large|bmiddle/, 'large') + '" target="_blank"><img src="' + i[0].replace(/large|bmiddle/, 'thumb150') + '"></a>';
			$.D.a($('up-list'), _li);
			/*
			var width = Number(i[1]),
			height = Number(i[2]);
			if (width > 380) {
				height *= 380 / width;
				width = 380
			}
			css($('mideaPop_pic'), 'width:' + width + 'px;height:' + height + 'px;')*/
		}
	}
	if (!history.pushState) {
		var old_hash = 'hallo';
		setInterval(function() {
			if (old_hash != location.hash) {
				$.P.popstate();
				old_hash = location.hash
			}
		}, 100)
	}
	/*
	window.onscroll = function() {
		if (!$('more')) {
			return
		}
		var _html = $.c('html')[0],
		_body = $.c('body')[0],
		_scrollTop = _html.scrollTop || _body.scrollTop;
		if (_scrollTop+_html.clientHeight == _body.scrollHeight && $.c($('more'), 'a')[0]) {
			location.href = $.c($('more'), 'a')[0].href
		}
	};
	*/
	return $
} (window, function(i) {
	return document.getElementById(i)
});
/*
alert = function(o) {
	o.id = 'msg';
	o.onclick = function() {
		o.className = ''
	};
	$.D.a(o);
	return function(i) {
		o.innerHTML = i;
		o.className = 'show'
	}
} ($.D.m('p'));
*/