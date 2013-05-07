/**
 * strong observe:
 *  listen click and keyup
 *  filter event target if(target is input[type="text"...] select...)
 *  
 * normal observe:
 *  addlistener to (input select)
 *  listen just 'change'
 *  
 * if el should a div, need to judge div is parent of el
 * mvvm
 */

var tags = ['INPUT', 'SELECT'];

function MVVM(o) {
	this.view = o.view; // we know view id then we know how much we control the observe(parent)
	this.model = o.model;
	this.vm = o.vm;
	this.updateView(); // it is default
	this.observe();
}

MVVM.prototype.bind = function(val) {
	var self = this;
	var e = this.lastEvent;
	var opts = {
		json: self.model,
		arr: e.name.split('.'),
		val: val,
		method: e.method
	}
	if (opts.method === 'delete') {
		opts.method = 'splice',
		opts.val = opts.arr.pop();
	}
	console.log(opts);
	arr2json(opts);	
	
	// default to updateView
	self.updateView();
}

MVVM.prototype.observe = function() {
	document.addEventListener('click', _listener);
    document.addEventListener('keyup', _listener);
	var self = this;
    function _listener(e) {
		var target = e.target || e.srcElement;
		if (target.name && target.name != '') {

			// get a name, it should be observe
			var method = target.getAttribute('method');
			if (method !== null && target.name !== '') {

				// this is a button like, can push/pop/del..
				// but need to get a val to input
				var lastEvent = {
					type: e.type,
					name: target.name,
					method: method
				}
				self.lastEvent = lastEvent;
				self.onclick && self.onclick(lastEvent);
				
			} else if (target.value) {

				// has a value, value may be changed, and it is sth can change model.
				var preVal = "";
				arr2json({
					arr: target.name.split('.'),
					json: self.model,
					getVal: function(val) {
						preVal = val;
					}
				});
				if (target.value != preVal) {
					
					// value is changed
					var changeKV = {
						name: target.name,
						val: target.value,
						preVal: preVal
					}

					// updateModel is default
					self.updateModel(changeKV);

					self.onchange && self.onchange({
						name: target.name,
						val: target.value,
						preVal: preVal
					});
				}
			}
		}
	}

}

MVVM.prototype.updateModel = function(kv) {
	var _arr = kv.name.split('.');
	arr2json({
		arr: _arr,
		val: kv.val,
		json: this.model
	});
}

MVVM.prototype.updateView = function() {
	document.getElementById(this.view).innerHTML = temp.render(this.vm, this.model);
}

function strongObserve(o) {
    document.addEventListener('click', _listener);
    document.addEventListener('keypress', _listener);
    function _listener(e) {
		var target = e.target || e.srcElement;
		if (target.name !== '') {

			// get a name, and it should be observe
			if (target.value) {

				// has a value,then it may be changed
				var preVal = "";
				arr2json({
					arr: target.name.split('.'),
					json: o.model,
					getVal: function(val) {
						preVal = val;
					}
				});
				if (target.value != preVal) {
					
					// value is changed
					o.onchange && o.onchange({
						name: target.name,
						val: target.value,
						preVal: preVal
					});
					// updateModel is default
				}
			}
		}
    }
}

function bindListener() {
    var inputs = document.getElementsByTagName('input');
    var selects = document.getElementsByTagName('select');
	var buttons = document.getElementsByTagName('button');
	var as = document.getElementsByTagName('a');

    var els = [];
	var clicks = [];

	var click_types = ['a', 'button'];

	for (var i = 0; i < buttons.length; i++) {
		console.log(buttons[i]);
		if (typeof buttons[i].name === "string" && buttons[i].getAttribute('method')) {
			clicks.push(buttons[i]);
		}
	}
	for (var i = 0; i < as.length; i++) {
		if (typeof as[i].name === "string" && typeof as[i].method === "string") {
			clicks.push(as[i]);
		}
	}
	for (var i = 0; i < clicks.length; i++) {
		clicks[i].addEventListener('click', _clickListener);
	}
	console.log(clicks);
	function _clickListener(_e) {
		e.method = _e.target.getAttribute("method");
		e.key = _e.target.name;
		var onclick = "onclick";
		if (onclick in o && typeof o[onclick] === 'function') {
			o[onclick](e);
		}
		//e.updateModel();
	}


    var types = ['text', 'checkbox', 'radio'];
    for (var i = 0; i < inputs.length; i++) {
        if (types.indexOf(inputs[i].type) != -1 && inputs[i].name !== '') {

			// name is a property in dom, if not defined, it is ''
            els.push(inputs[i]);
        }
    }
    for (var i = 0; i < selects.length; i++) {
        els.push(selects[i]);
    }
    for(var i = 0; i < els.length; i++) {
        els[i].addEventListener('change', _listener);
    }
    function _listener(_e) {
        if (typeof _e.target.name === "string") {
			e.key = _e.target.name;
			e.val = _e.target.value;
			var changeListener = 'onchange';
			e.updateModel();
			if (changeListener in o && typeof o[changeListener] === 'function') {
				
				o[changeListener](e);
			}
        }
    }

}

function weakObserve(o) {
	var e = new vmListener(o);
	
	e.updateView(o);
    //var bind = "bind";
    var inputs = document.getElementsByTagName('input');
    var selects = document.getElementsByTagName('select');
	var buttons = document.getElementsByTagName('button');
	var as = document.getElementsByTagName('a');

    var els = [];
	var clicks = [];

	var click_types = ['a', 'button'];

	for (var i = 0; i < buttons.length; i++) {
		console.log(buttons[i]);
		if (typeof buttons[i].name === "string" && buttons[i].getAttribute('method')) {
			clicks.push(buttons[i]);
		}
	}
	for (var i = 0; i < as.length; i++) {
		if (typeof as[i].name === "string" && typeof as[i].method === "string") {
			clicks.push(as[i]);
		}
	}
	for (var i = 0; i < clicks.length; i++) {
		clicks[i].addEventListener('click', _clickListener);
	}
	console.log(clicks);
	function _clickListener(_e) {
		e.method = _e.target.getAttribute("method");
		e.key = _e.target.name;
		var onclick = "onclick";
		if (onclick in o && typeof o[onclick] === 'function') {
			o[onclick](e);
		}
		//e.updateModel();
	}


    var types = ['text', 'checkbox', 'radio'];
    for (var i = 0; i < inputs.length; i++) {
        if (types.indexOf(inputs[i].type) != -1 && inputs[i].name !== '') {

			// name is a property in dom, if not defined, it is ''
            els.push(inputs[i]);
        }
    }
    for (var i = 0; i < selects.length; i++) {
        els.push(selects[i]);
    }
    for(var i = 0; i < els.length; i++) {
        els[i].addEventListener('change', _listener);
    }
    function _listener(_e) {
        if (typeof _e.target.name === "string") {
			e.key = _e.target.name;
			e.val = _e.target.value;
			var changeListener = 'onchange';
			e.updateModel();
			if (changeListener in o && typeof o[changeListener] === 'function') {
				
				o[changeListener](e);
			}
        }
    }
}

function vmListener(o) {
	this.vm = o.vm;
	this.model = o.model;
	this.view = o.view;
}

vmListener.prototype.push = function(val) {
	var _arr = this.key.split('.');
	arr2json({
		arr: _arr,
		val: val,
		json: this.model,
		method: this.method
	});
}

vmListener.prototype.updateView = function() {
	var htmlStr = temp.render(this.vm, this.model);
	document.getElementById(this.view).innerHTML = htmlStr;
	// may need to observe new dom
}

vmListener.prototype.updateModel = function() {
	var _arr = this.key.split('.');
	arr2json({
		arr: _arr,
		val: this.val,
		json: this.model
	});
}
/*
function updateView(o) {
	var htmlStr = temp.render(o.vm, o.model);
	document.getElementById(o.view).innerHTML = htmlStr;
}
function updateModel(key, val) {
    console.log(key,val);
	var _arr = key.split('.');
//	arr2json(_arr, model, val);
	arr2json({
		arr: _arr,
		val: val,
		json: model
	});
	//console.log(model.person1);
	//$('showmodel').innerHTML = JSON.stringify(model.person1, null, '\t');
}

*/

function testpush() {
arr2json({
	method: 'push',
	arr: ['person1', 'hosts'],
	json: model,
	val: {ip: '9827237', domain: 'www.163.com'}
})
$('showmodel').innerHTML = JSON.stringify(model.person1, null, '\t');
}


function arr2json(p) {

	if (p.arr.length === 1) {
		//console.log(p);
		if ('getVal' in p && typeof p.getVal === 'function') {
			p.getVal(p.json[p.arr[0]]);
		} else if (p.method && p.method in p.json[p.arr[0]]) {
			// I has the method!
			if (p.method === 'splice') {

				// need special handle
				p.json[p.arr[0]][p.method](p.val, 1);
			} else {
				p.json[p.arr[0]][p.method](p.val);
			}

		} else {
			p.json[p.arr[0]] = p.val;
		}
	} else {
		var tmp = p.arr.shift();
		if (typeof p.json[tmp] === 'object') {
			p.json = p.json[tmp];
			arr2json(p);
		} else {
			var last = "", str;
			for (var i = 0; i < p.arr.length; i++) {
				last += '}';
			}
			str = '{"' + p.arr.join('":{"') + '":' + '"1"' + last;
			p.json[tmp] = JSON.parse(str);
		}
	}
}

/*
function arr2json(arr, json, val) {
	if (arr.length === 1) {
		json[arr[0]] = val;
	} else {
		var tmp = arr.shift();
		if (typeof json[tmp] === 'object') {
			arr2json(arr, json[tmp], val);
		} else {
			var last = "", str;
			for (var i = 0; i < arr.length; i++) {
				last += '}';
			}
			str = '{"' + arr.join('":{"') + '":' + '"1"' + last;
			json[tmp] = JSON.parse(str);
		}
	}
}
*/
function genView(name) {
    var divs = getElementsByTagName('div');
    var div = null;
    for (var i = 0; i < divs.length; i++) {
        if (typeof divs[i].dataset.name === "string") {
            div = divs[i];
        }
    }
//    div.innerHTML = tmp.render()
}

function observe() {
    var inputs = document.getElementsByTagName('input');
    /*
    inputs.forEach(function(input) {
        input.addEventListener('propertyChange', function(e) {
            console.log(e);
        });
    });
    */
    for(var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('change', function(e) {
            alert(11);
            console.log(e);
        })
    }
    console.log(inputs);

    var selects = document.getElementsByTagName('select');
    for(var i = 0; i < selects.length; i++) {
        selects[i].addEventListener('change', function(e) {
            alert(22);
        })
    }
}


