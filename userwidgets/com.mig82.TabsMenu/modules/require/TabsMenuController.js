define(function() {

	var tabButtons = [];
	var signals = [];
	var underline;

	const steps = {
		100: {
			"stepConfig": {
				"timingFunction": kony.anim.EASE_IN_OUT
			}
		}
	};

	const config = {
		"duration":0.25,
		"iterationCount":1,
		"delay":0,
		"fillMode":kony.anim.FILL_MODE_FORWARDS
	};

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

	function resizeUnderline(parentFlex){
		underline.left = parentFlex.left;
		underline.width = parentFlex.width;
	}

	function toggleButtonSkins(touchedButton){
		for (var tabButton of tabButtons) {
			if(tabButton.id === touchedButton.id){
				touchedButton.skin = 'selectedTabButtonSkin';
			}
			else{
				touchedButton.skin = 'normalTabButtonSkin';
			}
		}
	}

	function slide(touchedButton, priorTab){

		var alignWithWidget = touchedButton.parent;
		steps["100"].left = alignWithWidget.left;
		steps["100"].width = alignWithWidget.width;

		var index = tabButtons.indexOf(touchedButton);
		var selected = signals[index];

		try{
			var animation = kony.ui.createAnimation(steps);
			underline.animate(animation, config, {
				animationStart: ()=>{},
				animationEnd: ()=>{
					/*globals amplify*/
					amplify.publish("TabsMenu.onTabSelected", selected, {
						priorTab: priorTab
					});
				}
			});
		}
		catch(e){
			kony.print(`Problem animating:\n\t${e}`);
		}
	}

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
					resizeUnderline(this.view.leftTabFlex);
					toggleButtonSkins(this.view.leftTabButton);
					break;

				case 'right':
					resizeUnderline(this.view.rightTabFlex);
					toggleButtonSkins(this.view.rightTabButton);
					break;

				default: //center
					resizeUnderline(this.view.centerTabFlex);
					toggleButtonSkins(this.view.centerTabButton);
			}

			tabButtons.forEach(localizeWidget);
		},

		postShow: function(){

			tabButtons.forEach((tabButton) => {
				//Add touch behaviour to each tab.
				tabButton.onTouchEnd = (touchedButton) => {
					toggleButtonSkins(touchedButton);
					slide(touchedButton, this._selectedTab);
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
