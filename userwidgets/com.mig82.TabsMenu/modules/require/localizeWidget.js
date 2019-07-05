/**
* Translate a widget attempting to use extension getLocalizedString2
*/
define(function () {

	function localizeWidget(widget){
		var text;
		if(typeof kony.i18n.getLocalizedString2 === "function"){
			text = kony.i18n.getLocalizedString2(widget.text);
		}
		else{
			text = kony.i18n.getLocalizedString(widget.text);
		}
		//alert(widget.text);
		widget.text = text;
	}

    return localizeWidget;
});