define([
	"./slide",
	"./localizeWidget",
	"./positionDecoration",
	"./toggleButtonSkins",
	"./slideTabs"],
	function(slide, localizeWidget, positionDecoration, toggleButtonSkins, slideTabs) {

	var view;
	var tabButtons = [];
	var signals = [];
	var underline;

	const doNothing = ()=>{};

	return {

		preShow: function(){

			view = this.view;
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

		onTouchedTab: function(touchedButton){

			//First disable all buttons;
			tabButtons.forEach((button) => {
				button.onTouchEnd = doNothing;
			});
			toggleButtonSkins(touchedButton, tabButtons);
			slide(touchedButton, this._selectedTab, tabButtons, signals, underline);
		},

		postShow: function(){

			tabButtons.forEach((tabButton) => {
				//Add touch behaviour to each tab.
				tabButton.onTouchEnd = this.onTouchedTab;
			});
		},

		preHide: function(){
			slideTabs(false, view.animationFlex);
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
