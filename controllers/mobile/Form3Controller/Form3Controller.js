define(function(){

	function onTabSelected(friendlyName, context){
		alert(`Form3\nPrior: ${context.priorTab}\nNew2:${friendlyName}`);
		$router.goto(friendlyName, context);
	}

	return {

		postShow: function(){
			amplify.subscribe("TabsMenu.onTabSelected", onTabSelected);
		},

		onHide: function(){
			amplify.unsubscribe("TabsMenu.onTabSelected", onTabSelected);
		},

		onNavigate: function(){
			kony.mvc.patch(this);
		}
	};
});
