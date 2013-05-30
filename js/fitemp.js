var temp = {};

(function(exports){

exports.render = function(id,data){	
	var source = id;
	if(id.indexOf('<') === -1 && typeof document === 'object'){
		source = document.getElementById(id).innerHTML;
	}	
	
	var funcCode = "";
	funcCode += genVal(data);
	var _start = "<\%";
	var _end = "%>";
	var srcArr = source.split(_start);
	for(var i = 0; i < srcArr.length; i++){
		var tempCode = srcArr[i].split(_end);
		if(tempCode.length === 1){
			funcCode += genHTML(tempCode[0]);
		}
		else if(tempCode.length === 2){
			funcCode += genJS(tempCode[0]) + genHTML(tempCode[1]);			
		}
	}
	funcCode += "return output;"
	
	var genFunc = new Function('data',funcCode);	
	//console.log(genFunc);
	var result = genFunc(data);
	return result;	
}

function genVal(data){
	var funcCode = "";
	for(var key in data){
		funcCode += 'var '+key+' = data.'+key+';\n';
	}
	funcCode += "var output = '';\n";
	
	return funcCode;
}
/*
var data = {
	year:['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']
}
*/
function genJS(str){
	var funcCode = "";	
	if(str.indexOf('=') === 0){
		funcCode += "output += "+str.substring(1,str.length)+";\n";
	}
	else{
		funcCode += str+'\n';
	}	
	
	return funcCode;
}
function genHTML(str){

	str = str.replace(/('|"|\\)/g, '\\$1')       
			 .replace(/\r/g, '\\r')
			 .replace(/\n/g, '\\n');	
	var funcCode = 'output += "'+str+'";\n';		
	return funcCode;
}

})(temp); 

if(typeof module !== 'undefined' && module.exports){
	module.exports = temp;
}
else{
	window.temp = temp;
}