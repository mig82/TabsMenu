/**
* Slide the "underlining" decoration to position it under the newly selected tab.
*/
define(function () {

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

	function slide(touchedButton, priorTab, tabButtons, signals, underline){

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

    return slide;
});