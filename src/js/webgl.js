var Webgl = (function(){

    function Webgl(width, height){
        webgl = this;
        // Basic three.js setup
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
        this.camera.position.z = 300;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0xebc130);

        this.cubesDim = 100;

        this.cube = new Cube(1, 10, 0);
        this.cube.position.set(-this.cubesDim/2, -this.cubesDim/2 , 0);
        this.scene.add(this.cube);

        var scaleXCube = new TimelineLite();
        scaleXCube.to(this.cube.scale, 0.8, {x: this.cubesDim, ease: Expo.easeIn});

        var positionXCube = new TimelineLite();
        positionXCube.to(this.cube.position, 0.8, {x: 0, ease: Expo.easeIn});

        var scaleYCube = new TimelineLite();
        scaleYCube.to(this.cube.scale, 0.8, {y: this.cubesDim/10, delay: 0.8, ease: Expo.easeOut});

        var positionYCube = new TimelineLite();
        positionYCube.to(this.cube.position, 0.8, {y: 0, delay: 0.8, ease: Expo.easeOut, onComplete: function() {
            animateTwoSquares();
        }});

        this.genericCube = new Cube(1, 1, 0);
        this.genericCube.position.set(0, 0, 0);

        this.flatCube = this.genericCube.clone();
        this.flatCube.scale.x = this.cubesDim;
        this.flatCube.scale.y = this.cubesDim;

        this.cubes = [this.flatCube.clone(), this.flatCube.clone()];

        var animateTwoSquares = function() {
            webgl.scene.add(webgl.cubes[0]);
            webgl.scene.add(webgl.cubes[1]);

            var positionCube0 = new TimelineLite();
            positionCube0.to(webgl.cubes[0].position, 0.8, {x: -150, ease: Expo.easeOut});

            var positionCube1 = new TimelineLite();
            positionCube1.to(webgl.cubes[1].position, 0.8, {x: 150, ease: Expo.easeOut, onComplete: function() {
                awayCamera();  
            }});
        }

        var awayCamera = function() {
            var cameraPosition = new TimelineLite();
            cameraPosition.to(webgl.camera.position, 0.8, {z: 1000, ease: Expo.easeOut, onComplete: function() {
                displayHorizontalCubes();
                popCubes(2, 7);
                popCubes(8, 13);
                displayVerticalCubes();
            }});
        }

        function popCubes(minIndex, maxIndex) {
            var j = 0;
            for (var i = minIndex; i <= maxIndex; i++) {
                var cube = webgl.cubes[i];
                webgl.scene.add(cube);
                var scaleCube = new TimelineLite();
                scaleCube.to(cube.scale, 0.3, {x: webgl.cubesDim, y: webgl.cubesDim, z: 1, ease: Expo.easeOut, delay: j*0.1});
                j++;
            }
        }

        function displayHorizontalCubes() {
            // Left
            for (var i = -2; i >= -7; i--) {
                var cube = webgl.genericCube.clone();
                cube.position.set(i* 150 ,0, 0);
                webgl.cubes.push(cube);
            }
            // Right
            for (var i = 2; i <= 7; i++) {
                var cube = webgl.genericCube.clone();
                cube.position.set(i* 150 ,0, 0);
                webgl.cubes.push(cube);
            }
        }

        function displayVerticalCubes() {
            for (var j = -7; j <= 7; j++) {
                for (var i = 1; i <= 3; i++) {
                    var cube = webgl.genericCube.clone();
                    cube.position.set(j*150, i*150, 0);
                    cube.scale.x = 0.1;
                    cube.scale.y = 0.1;
                    webgl.cubes.push(cube);
                    webgl.scene.add(cube);
                    var scaleCube = new TimelineLite();
                    scaleCube.to(cube.scale, 0.3, {x: webgl.cubesDim, y: webgl.cubesDim, z: 1, ease: Expo.easeOut, delay: (j*0.1)+1});
                }
                for (var i = -1; i >= -3; i--) {
                    var cube = webgl.genericCube.clone();
                    cube.position.set(j*150, i*150, 0);
                    cube.scale.x = 0.1;
                    cube.scale.y = 0.1;
                    webgl.cubes.push(cube);
                    webgl.scene.add(cube);
                    var scaleCube = new TimelineLite();
                    scaleCube.to(cube.scale, 0.3, {x: webgl.cubesDim, y: webgl.cubesDim, z: 1, ease: Expo.easeOut, delay: (j*0.1)+1});
                }
            }
            
        }

    }

    Webgl.prototype.resize = function(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    };

    Webgl.prototype.render = function() {    
        this.renderer.render(this.scene, this.camera);

        // this.someObject.rotation.y += 0.01;
        // this.someObject.rotation.x += 0.01;

        //this.triangle.update();
    };

    Webgl.prototype.update = function() {
        // find intersections

    // create a Ray with origin at the mouse position
    //   and direction into the scene (camera direction)
    var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);
    projector.unprojectVector( vector, camera );
    var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

    // create an array containing all objects in the scene with which the ray intersects
    var intersects = ray.intersectObjects( scene.children );
    
    // if there is one (or more) intersections
    if ( intersects.length > 0 )
    {
        // if the closest object intersected is not the currently stored intersection object
        if ( intersects[ 0 ].object != INTERSECTED ) 
        {
            // restore previous intersection object (if it exists) to its original color
            if ( INTERSECTED ) 
                INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
            // store reference to closest object as current intersection object
            INTERSECTED = intersects[ 0 ].object;
            // store color of closest object (for later restoration)
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
            // set a new color for closest object
            INTERSECTED.material.color.setHex( 0xffff00 );
        }
    } 
    else // there are no intersections
    {
        // restore previous intersection object (if it exists) to its original color
        if ( INTERSECTED ) 
            INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
        // remove previous intersection object reference
        //     by setting current intersection object to "nothing"
        INTERSECTED = null;
    }

    return Webgl;

})();