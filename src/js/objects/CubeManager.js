var CubeManager = (function(){

	function CubeManager(){
		this.cubesDim = 100;
		this.cubes = [];
	}

	function animateTwoSquares(duration) {
        TweenLite.to(this.cubes[1].position, duration, {x: -150, ease: Expo.easeOut});

        TweenLite.to(this.cubes[2].position, duration, {x: 150, ease: Expo.easeOut, onComplete: function() {
            awayCamera();  
        }});
    }

    function displayHorizontalCubes() {
        // Left
        for (var i = -2; i >= -7; i--) {
            var cube = new Cube(1, 1, 1);
            cube.position.set(i* 150 ,0, 0);
            this.cubes.push(cube);
        }
        // Right
        for (var i = 2; i <= 7; i++) {
            var cube = new Cube(1, 1, 1);
            cube.position.set(i* 150 ,0, 0);
            this.cubes.push(cube);
        }
    }

    return CubeManager;

})();