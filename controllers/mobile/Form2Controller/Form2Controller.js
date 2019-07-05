define(function(){

	/*globals $router, amplify*/
	function onTabSelected(friendlyName, context){
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
