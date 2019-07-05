define(function() {

	var tabButtons = [];
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

		try{
			var animation = kony.ui.createAnimation(steps);
			underline.animate(animation, config, {
				animationStart: ()=>{},
				animationEnd: ()=>{
					/*globals amplify*/
					amplify.publish("TabsMenu.onTabSelected", index, {
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
		},

		constructor: function(/*baseConfig, layoutConfig, pspConfig*/) {

			var view = this.view;
			underline = view.tabUnderlineFlex;

			/*This is the tab (left, center or right) selected when the component is created.
			to pass it along as the prior tab when another is selected.*/
			var priorTab = this._selectedTab;

			tabButtons = [
				view.leftTabButton,
				view.centerTabButton,
				view.rightTabButton
			];

			tabButtons.forEach((tabButton) => {

				//Translate the widget.
				localizeWidget(tabButton);

				tabButton.onTouchEnd = (touchedButton) => {
					toggleButtonSkins(touchedButton);
					slide(touchedButton, priorTab);
				};
			});

			view.preShow = this.preShow;
		},

		//Logic for getters/setters of custom properties
		initGettersSetters: function() {
			defineGetter(this, "selectedTab", () => {return this._selectedTab;});
			defineSetter(this, "selectedTab", (selectedTab) => {this._selectedTab = selectedTab;});
		}
	};
});
