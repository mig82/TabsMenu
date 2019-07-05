define(function () {
	function toggleButtonSkins(touchedButton, tabButtons){
		for (var tabButton of tabButtons) {
			if(tabButton.id === touchedButton.id){
				touchedButton.skin = 'selectedTabButtonSkin';
			}
			else{
				touchedButton.skin = 'normalTabButtonSkin';
			}
		}
	}
    return toggleButtonSkins;
});