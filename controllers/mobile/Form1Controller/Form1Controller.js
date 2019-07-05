define(function(){

	/*globals $router, amplify*/
	function onTabSelected(selectedTab, context){
		$router.goto(selectedTab, context);
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
