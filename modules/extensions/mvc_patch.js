((definition) => {
	kony.mvc.patch = definition;
})((controller) => {

	const events = [
		"init",
		"preShow",
		"postShow",
		"onHide"
	];

	//TODO: Do this only once for each controller.

	var view = controller.view;
	events.forEach((eventName) => {
		if(typeof controller[eventName] === "function"){
			view[eventName] = function(){
				try{
					kony.print(`*******Event fired: ${view.id}.${eventName}`);
					controller[eventName]();
				}
				catch(e){
					alert(e);
				}
			};
		}
	});

});
