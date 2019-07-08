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

	function slideTabs(visible, flex){

		var event = "";
		if(visible){
			steps["100"].bottom = "0%";
			event = "TabsMenu.onShow";
		}
		else{
			steps["100"].bottom = "100%";
			event = "TabsMenu.onHide";
		}

		try{
			var animation = kony.ui.createAnimation(steps);
			flex.animate(animation, config, {
				animationStart: ()=>{},
				animationEnd: ()=>{
					/*globals amplify*/
					amplify.publish(event);
				}
			});
		}
		catch(e){
			kony.print(`Problem animating:\n\t${e}`);
		}
	}

    return slideTabs;
});
