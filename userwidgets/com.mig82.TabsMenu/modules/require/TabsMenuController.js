define([
	"./slide",
	"./localizeWidget",
	"./positionDecoration",
	"./toggleButtonSkins"],
	function(slide, localizeWidget, positionDecoration, toggleButtonSkins) {

	var tabButtons = [];
	var signals = [];
	var underline;

	return {

		preShow: function(){

			var view = this.view;
			underline = view.tabUnderlineFlex;

			tabButtons = [
				view.leftTabButton,
				view.centerTabButton,
				view.rightTabButton
			];

			signals = [
				this._leftSignal,
				this._centerSignal,
				this._rightSignal
			];

			switch(this._selectedTab){
				case 'left':
					positionDecoration(underline, view.leftTabFlex);
					toggleButtonSkins(view.leftTabButton, tabButtons);
					break;

				case 'right':
					positionDecoration(underline, view.rightTabFlex);
					toggleButtonSkins(view.rightTabButton, tabButtons);
					break;

				default: //center
					positionDecoration(underline, view.centerTabFlex);
					toggleButtonSkins(view.centerTabButton, tabButtons);
			}

			tabButtons.forEach(localizeWidget);
		},

		postShow: function(){

			tabButtons.forEach((tabButton) => {
				//Add touch behaviour to each tab.
				tabButton.onTouchEnd = (touchedButton) => {
					toggleButtonSkins(touchedButton, tabButtons);
					slide(touchedButton, this._selectedTab, tabButtons, signals, underline);
				};
			});
		},

		constructor: function(/*baseConfig, layoutConfig, pspConfig*/) {
			kony.mvc.patch(this);
		},

		//Logic for getters/setters of custom properties
		initGettersSetters: function() {
			kony.mvc.genAccessors(this, [
				"selectedTab",
				"leftSignal",
				"centerSignal",
				"rightSignal"
			]);
		}
	};
});
