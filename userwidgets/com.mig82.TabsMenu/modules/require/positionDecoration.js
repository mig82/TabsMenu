define(function () {

	function positionDecoration(decoration, parentFlex){
		decoration.left = parentFlex.left;
		decoration.width = parentFlex.width;
	}
    return positionDecoration;
});