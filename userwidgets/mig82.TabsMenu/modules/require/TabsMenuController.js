define(function() {

	var tabButtons = [];

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

	function slideAndNavigate(tabUnderlineFlex, touchedButton){

		var alignWithWidget = touchedButton.parent;
		steps["100"].left = alignWithWidget.left;
		steps["100"].width = alignWithWidget.width;

		var index = tabButtons.indexOf(touchedButton);

		try{
			var animation = kony.ui.createAnimation(steps);
			tabUnderlineFlex.animate(animation, config, {
				animationStart: ()=>{},
				animationEnd: ()=>{
					/*globals amplify*/
					amplify.publish("TabsMenu.onTabSelected", index, {
						//priorTab: this._selectedTab
					});
				}
			});
		}
		catch(e){
			kony.print(`Problem animating:\n\t${e}`);
		}
	}

	return {

		setSelectedTab: function(){

			var underline = this.view.tabUnderlineFlex;
			var leftTab = this.view.leftTabFlex;
			var centerTab = this.view.centerTabFlex;
			var rightTab = this.view.rightTabFlex;

			//alert(underline.frame);
			switch(this._selectedTab){
				case 'left':
					underline.left = leftTab.left;
					underline.width = leftTab.width;
					toggleButtonSkins(this.view.leftTabButton);
					break;

				case 'right':
					underline.left = rightTab.left;
					underline.width = rightTab.width;
					toggleButtonSkins(this.view.rightTabButton);
					break;

				default: //center
					underline.left = centerTab.left;
					underline.width = centerTab.width;
					toggleButtonSkins(this.view.centerTabButton);
			}
			//alert(this._selectedTab + ' Vs ' + underline.left);
		},

		constructor: function(/*baseConfig, layoutConfig, pspConfig*/) {

			var view = this.view;
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
					slideAndNavigate(view.tabUnderlineFlex, touchedButton);
				};
			});

			view.preShow = this.setSelectedTab;
		},

		//Logic for getters/setters of custom properties
		initGettersSetters: function() {
			defineGetter(this, "selectedTab", () => {return this._selectedTab;});
			defineSetter(this, "selectedTab", (selectedTab) => {this._selectedTab = selectedTab;});
		}
	};
});
