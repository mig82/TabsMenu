define(function() {

	return {

		localizeWidget: function(widget){
			var text;
			if(typeof kony.i18n.getLocalizedString2 === "function"){
				text = kony.i18n.getLocalizedString2(widget.text);
			}
			else{
				text = kony.i18n.getLocalizedString(widget.text);
			}
			//alert(widget.text);
			widget.text = text;
		},

		toggleSelectedTabButton: function(widget, selected){
			if(selected){
				widget.skin = 'selectedTabButtonSkin';
			}
			else{
				widget.skin = 'normalTabButtonSkin';
			}
		},

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

					this.toggleSelectedTabButton(this.view.leftTabButton, true);
					this.toggleSelectedTabButton(this.view.centerTabButton, false);
					this.toggleSelectedTabButton(this.view.rightTabButton, false);
					break;

				case 'right':

					underline.left = rightTab.left;
					underline.width = rightTab.width;

					this.toggleSelectedTabButton(this.view.leftTabButton, false);
					this.toggleSelectedTabButton(this.view.centerTabButton, false);
					this.toggleSelectedTabButton(this.view.rightTabButton, true);
					break;

				default: //center

					underline.left = centerTab.left;
					underline.width = centerTab.width;

					this.toggleSelectedTabButton(this.view.leftTabButton, false);
					this.toggleSelectedTabButton(this.view.centerTabButton, true);
					this.toggleSelectedTabButton(this.view.rightTabButton, false);
			}
			//alert(this._selectedTab + ' Vs ' + underline.left);
		},

		slideAndNavigate: function(friendlyName, alignWithWidget){
			var steps = {
				100: {
					"left": alignWithWidget.left,
					"width": alignWithWidget.width,
					"stepConfig": {
						"timingFunction": kony.anim.EASE_IN_OUT
					}
				}
			};

			var config = {
				"duration":0.25,
				"iterationCount":1,
				"delay":0,
				"fillMode":kony.anim.FILL_MODE_FORWARDS
			};

			$q2k.animate(this.view.tabUnderlineFlex, steps, config)
			.then(() => {
				//$router.goto(friendlyName, {});
				amplify.publish("TabsMenu.onTabSelected", friendlyName, {
					priorTab: this._selectedTab
				});
			});
		},

		constructor: function(baseConfig, layoutConfig, pspConfig) {

			this.localizeWidget(this.view.leftTabButton);
			this.localizeWidget(this.view.centerTabButton);
			this.localizeWidget(this.view.rightTabButton);

			this.view.preShow = this.setSelectedTab;

			this.view.leftTabButton.onTouchEnd = () => {

				this.toggleSelectedTabButton(this.view.leftTabButton, true);
				this.toggleSelectedTabButton(this.view.centerTabButton, false);
				this.toggleSelectedTabButton(this.view.rightTabButton, false);

				this.slideAndNavigate(this._leftTabTarget, this.view.leftTabFlex);
			};

			this.view.centerTabButton.onTouchEnd = () => {

				this.toggleSelectedTabButton(this.view.leftTabButton, false);
				this.toggleSelectedTabButton(this.view.centerTabButton, true);
				this.toggleSelectedTabButton(this.view.rightTabButton, false);

				this.slideAndNavigate(this._centerTabTarget, this.view.centerTabFlex);
			};

			this.view.rightTabButton.onTouchEnd = () => {

				this.toggleSelectedTabButton(this.view.leftTabButton, false);
				this.toggleSelectedTabButton(this.view.centerTabButton, false);
				this.toggleSelectedTabButton(this.view.rightTabButton, true);

				this.slideAndNavigate(this._rightTabTarget, this.view.rightTabFlex);
			};
		},
		//Logic for getters/setters of custom properties
		initGettersSetters: function() {

			defineGetter(this, "leftTabTarget", () => {return this._leftTabTarget;});
			defineSetter(this, "leftTabTarget", (friendlyName) => {this._leftTabTarget = friendlyName;});

			defineGetter(this, "centerTabTarget", () => {return this._centerTabTarget;});
			defineSetter(this, "centerTabTarget", (friendlyName) => {this._centerTabTarget = friendlyName;});

			defineGetter(this, "rightTabTarget", () => {return this._rightTabTarget;});
			defineSetter(this, "rightTabTarget", (friendlyName) => {this._rightTabTarget = friendlyName;});

			defineGetter(this, "selectedTab", () => {return this._selectedTab;});
			defineSetter(this, "selectedTab", (selectedTab) => {this._selectedTab = selectedTab;});
		}
	};
});
