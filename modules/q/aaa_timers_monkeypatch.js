
/**
 * 
 ************************************
 *      Timeout MonkeyPatch         *
 * **********************************
 * Version: 1.0.1
 * 
 * Description: 
 * Defines the setTimeout, setInterval, clearTimeout and clearInterval functions whenever they are not defined.
 * This is necessary in Android, iOS and other non-browser environments when leveraging third party javascript libraries
 * which depend these function definitions -e.g. Promises polyfills and Kris Kowal's Q.
 * 
 * Implementation Notes:
 * 1) Uses the 'eval' function to avoid even declaring setTimeout, setInterval, clearTiemout and clearInterval unless
 * they're not already defined. This is necessary because simply defining them always will overwrite the native definitions
 * in browser environments, and declaring them and optionally initializing them will undefine them.
 * 
 * 2) Can't wrap in closure notation as there seems to be no global variable -equivalent
 * to window or self- in non-browser environments, so there would be nothing to attach
 * it to. Therefore it just has to be declared as a global variable.
 * 
 * 3) Prefix "aaa" to module name is important to try and force this to be loaded before
 * any other javascript libraries that might be dependant setTimeout and clearTimeout
 * being already defined.
 * 
 * 4) The actual definitions of the functions are wrapped in a closure because they're based on kony.timer.schedule(id, fn, delay, repeat)
 * which in turn requires the first input parameter to be the id of the scheduled task. This id is defined as a count of the previously
 * created timeouts and intervals to ensure uniqueness and the closure ensures it can't be tampered with by any other code.
 * 
 * Author: Miguelangel Fernandez, miguelangel.fernandez@kony.com
 * 
 */

var monkeyPatch = (function(){

	var timeoutId = 0;
	
	function _setTimeout(fn, msDelay){
		var id = ++timeoutId;
		kony.timer.schedule(""+id, fn, msDelay/1000, false);
		return id;
	}
	
	function _setInterval(fn, msDelay){
		var id = ++timeoutId;
		kony.timer.schedule(""+id, fn, msDelay/1000, true);
		return id;
	}
	
	function _clearTimeout(timeoutId){
		kony.timer.cancel(timeoutId);
	}
	
	function _clearInterval(timeoutId){
		kony.timer.cancel(timeoutId);
	}
	
	var _monkey = {
		setTimeout: _setTimeout,
		setInterval: _setInterval,
		clearTimeout: _clearTimeout,
		clearInterval: _clearInterval
	};
	
	return _monkey;
}); 

var missingTimeout = typeof setTimeout !== "function";
var missingInterval = typeof setInterval !== "function";

if( missingTimeout | missingInterval ){

	var monkey = monkeyPatch();
	
	if(missingTimeout){
		eval("var setTimeout = monkey.setTimeout");
		eval("var clearTimeout = monkey.clearTimeout");
		kony.print("Had to monkeypatch setTimeout to: " + setTimeout);
	}
	else{
		kony.print("setTimeout is natively supported as: " + setTimeout);
	}

	if(missingInterval){
		eval("var setInterval = monkey.setInterval");
		eval("var clearInterval = monkey.clearInterval");
		kony.print("Had to monkeypatch setInterval to: " + setInterval);
	}
	else{
		kony.print("setInterval is natively supported as: " + setInterval);
	}
}
