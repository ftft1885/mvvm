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

function strongObserve(parent) {
    document.addEventListener('click', _listener);
    document.addEventListener('keyup', _listener);
    function _listener(e) {
        if (tags.indexOf(e.target.tagName) != -1) {
            console.log(e.target.dataset.bind);
            
        }
    }
}

function weakObserve(parent) {
    var bind = "bind";
    var inputs = document.getElementsByTagName('input');
    var selects = document.getElementsByTagName('select');
    var els = [];
    var types = ['text', 'checkbox', 'radio'];
    for (var i = 0; i < inputs.length; i++) {
        if (types.indexOf(inputs[i].type) != -1) {
            els.push(inputs[i]);
        }
    }
    for (var i = 0; i < selects.length; i++) {
        els.push(selects[i]);
    }
    for(var i = 0; i < els.length; i++) {
        els[i].addEventListener('change', _listener);
    }
    function _listener(e) {
        if (typeof e.target.name === "string") {
            updateModel(e.target.name, e.target.value);
        }
    }
}

function updateModel(key, val) {
    console.log(key,val);
}

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


