var CubeManager = (function(){

	function CubeManager(){
		this.cubesDim = 100;
        this.cubesRotation = false;
		this.cubes = [];
	}

    CubeManager.prototype.constructor = CubeManager;

    CubeManager.prototype.animateFirstSquare = function() {
        cubeManager = this;
        var cube = new Cube(1, 1, 1);
        cube.scale.y = 10;
        cube.position.set(-this.cubesDim/2, -this.cubesDim/2 , 0);
        webgl.scene.add(cube);
        this.cubes = [cube];

        TweenLite.to(cube.scale, 0.8, {x: this.cubesDim, ease: Expo.easeIn});

        TweenLite.to(cube.position, 0.8, {x: 0, ease: Expo.easeIn});

        TweenLite.to(cube.scale, 0.8, {y: this.cubesDim, delay: 0.8, ease: Expo.easeOut});

        TweenLite.to(cube.position, 0.8, {y: 0, delay: 0.8, ease: Expo.easeOut, onComplete: function() {
            cubeManager.animateTwoSquares();
        }});
    };

    CubeManager.prototype.animateTwoSquares = function() {
        this.cubes.push(new Cube(1, 1, 1), new Cube(1, 1, 1));
        this.cubes[1].scale.x = this.cubesDim;
        this.cubes[1].scale.y = this.cubesDim;
        this.cubes[2].scale.x = this.cubesDim;
        this.cubes[2].scale.y = this.cubesDim;

        webgl.scene.add(this.cubes[1]);
        webgl.scene.add(this.cubes[2]);

        TweenLite.to(this.cubes[1].position, 0.8, {x: -150, ease: Expo.easeOut});

        TweenLite.to(this.cubes[2].position, 0.8, {x: 150, ease: Expo.easeOut, onComplete: function() {
            webgl.awayCamera();  
        }});
    };

    CubeManager.prototype.displayHorizontalCubes = function() {
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
    };

    CubeManager.prototype.popCubes = function(minIndex, maxIndex) {
        var j = 0;
        for (var i = minIndex; i <= maxIndex; i++) {
            var cube = this.cubes[i];
            webgl.scene.add(cube);
            TweenLite.to(cube.scale, 0.3, {x: this.cubesDim, y: this.cubesDim, z: 1, ease: Expo.easeOut, delay: j*0.1, onStart:function() {
                document.getElementById('pop').play();
            }});
            j++;
        }
    };

    CubeManager.prototype.displayVerticalCubes = function() {
        for (var j = -7; j <= 7; j++) {
            for (var i = 1; i <= 3; i++) {
                var cube = new Cube(1, 1, 1);
                cube.position.set(j*150, i*150, 0);
                cube.scale.x = 0.1;
                cube.scale.y = 0.1;
                this.cubes.push(cube);
                webgl.scene.add(cube);
                TweenLite.to(cube.scale, 0.3, {x: this.cubesDim, y: this.cubesDim, z: 1, ease: Expo.easeOut, delay: (j*0.1)+1, onStart: function() {
                    document.getElementById('pop').play();
                }});
            }
            for (var i = -1; i >= -3; i--) {
                var cube = new Cube(1, 1, 1);
                cube.position.set(j*150, i*150, 0);
                cube.scale.x = 0.1;
                cube.scale.y = 0.1;
                this.cubes.push(cube);
                webgl.scene.add(cube);
                TweenLite.to(cube.scale, 0.3, {x: this.cubesDim, y: this.cubesDim, z: 1, ease: Expo.easeOut, delay: (j*0.1)+1, onStart: function() {
                    document.getElementById('pop').play();
                }});
            }
        }
        
    };

    CubeManager.prototype.addZCubes = function() {
        cubeManager = this;
        var i = 0;
        for (i = 0; i < this.cubes.length; i++) {
            TweenLite.to(this.cubes[i].scale, 1, {x: 100, y: 100, z: 100, delay: 0.4, ease: Expo.easeOut, onStart: function() {
                webgl.endingInteraction = true;
            },
            onComplete: function() {
                window.setTimeout(function() {
                    cubeManager.cubesRotation = true;
                    document.getElementById('c2c').play();
                    webgl.moveLight();
                }, 500);
            }});
        }
    };

    CubeManager.prototype.rotateCubes = function() {
        if (webgl.counter % 200 == 0) {
            this.rotationSpeed = webgl.counter / 200 * 0.01;
        }
        var i = 0;
        for (i = 0; i < this.cubes.length; i++) {
            this.cubes[i].rotation.x += this.rotationSpeed;
        }

        if (webgl.counter == 1000) {
            this.moveCubesToCenter();
            webgl.counter = -1
        }
        
        if (webgl.counter >= 0) {
            webgl.counter += 1;
        }
    };

    CubeManager.prototype.moveCubesToCenter = function() {
        cubeManager = this;
        for (i = 0; i < this.cubes.length; i++) {
            TweenLite.to(this.cubes[i].position, 7, {x: 0, y: 0, z: 0, ease: Quad.easeIn, delay: i*0.03});
            TweenLite.to(this.cubes[i].rotation, 1, {z: -10, ease: Quad.easeIn, delay: i*0.03});
            TweenLite.to(this.cubes[i].rotation, 1, {z: 10, ease: Quad.easeIn, delay: i*0.03 + 4.15});
        }
        window.setTimeout(function() {
            cubeManager.removeAllCubesButFirst();
            TweenLite.to(cubeManager.cubes[0].rotation, 1, {z: 0, ease: Quad.easeIn});
        }, 10150);
    };

    CubeManager.prototype.removeAllCubesButFirst = function() {
        for (i = 1; i < this.cubes.length; i++) {
            webgl.scene.remove(this.cubes[i]);
        }
        var firstCube = this.cubes[0];
        this.cubes = [firstCube];
        this.growCube();
    };

    CubeManager.prototype.growCube = function() {
        cubeManager = this;
        TweenLite.to(this.cubes[0].scale, 0.8, {x: 300, y: 300, z: 300, ease: Expo.easeIn, onComplete: function() {
            cubeManager.cubesRotation = false;
            TweenLite.to(cubeManager.cubes[0].rotation, 1.2, {x: 0, onComplete: function() {
                window.setTimeout(function() {
                    webgl.scene.remove(cubeManager.cubes[0]);

                    webgl.cubeParticles = new CubeParticles();
                    webgl.spreadParticles = true;
                    webgl.scene.add(webgl.cubeParticles);
                    webgl.cubeParticles.explode();
                }, 1000);

                window.setTimeout(function() {
                    webgl.glichEffect = true;
                }, 4000);
            }});
        }});
    }

    return CubeManager;

})();