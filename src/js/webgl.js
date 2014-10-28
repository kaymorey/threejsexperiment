var Webgl = (function(){

    function Webgl(width, height){
        webgl = this;

        this.mouse = { x: 0, y: 0 };
        this.INTERSECTED;

        this.hoverInteraction = false;
        this.cubesRotation = false;

        // Basic three.js setup
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
        this.camera.position.z = 300;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0xebc130);

        var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );

        var light = new THREE.PointLight( 0xff0040, 2, 50 );
        light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
        light.position.set( 200, 200, 500 );
        this.scene.add( light );

        this.cubesDim = 100;

        this.cube = new Cube(1, 10, 1);
        this.cube.position.set(-this.cubesDim/2, -this.cubesDim/2 , 0);
        this.scene.add(this.cube);

        TweenLite.to(this.cube.scale, 0.8, {x: this.cubesDim, ease: Expo.easeIn});

        TweenLite.to(this.cube.position, 0.8, {x: 0, ease: Expo.easeIn});

        TweenLite.to(this.cube.scale, 0.8, {y: this.cubesDim/10, delay: 0.8, ease: Expo.easeOut});

        TweenLite.to(this.cube.position, 0.8, {y: 0, delay: 0.8, ease: Expo.easeOut, onComplete: function() {
            animateTwoSquares();
        }});

        this.cubes = [new Cube(this.cubesDim, this.cubesDim, 1), new Cube(this.cubesDim, this.cubesDim, 1)];

        var animateTwoSquares = function() {
            webgl.scene.add(webgl.cubes[0]);
            webgl.scene.add(webgl.cubes[1]);

            TweenLite.to(webgl.cubes[0].position, 0.8, {x: -150, ease: Expo.easeOut});

            TweenLite.to(webgl.cubes[1].position, 0.8, {x: 150, ease: Expo.easeOut, onComplete: function() {
                awayCamera();  
            }});
        }

        var awayCamera = function() {
            TweenLite.to(webgl.camera.position, 0.8, {z: 1000, ease: Expo.easeOut, onComplete: function() {
                displayHorizontalCubes();
                popCubes(2, 7);
                popCubes(8, 13);
                displayVerticalCubes();
                webgl.hoverInteraction = true;
                addZCubes();
            }});
        }

        function popCubes(minIndex, maxIndex) {
            var j = 0;
            for (var i = minIndex; i <= maxIndex; i++) {
                var cube = webgl.cubes[i];
                webgl.scene.add(cube);
                TweenLite.to(cube.scale, 0.3, {x: webgl.cubesDim, y: webgl.cubesDim, z: 1, ease: Expo.easeOut, delay: j*0.1});
                j++;
            }
        }

        function displayHorizontalCubes() {
            // Left
            for (var i = -2; i >= -7; i--) {
                var cube = new Cube(1, 1, 1);
                cube.position.set(i* 150 ,0, 0);
                webgl.cubes.push(cube);
            }
            // Right
            for (var i = 2; i <= 7; i++) {
                var cube = new Cube(1, 1, 1);
                cube.position.set(i* 150 ,0, 0);
                webgl.cubes.push(cube);
            }
        }

        function displayVerticalCubes() {
            for (var j = -7; j <= 7; j++) {
                for (var i = 1; i <= 3; i++) {
                    var cube = new Cube(1, 1, 1);
                    cube.position.set(j*150, i*150, 0);
                    cube.scale.x = 0.1;
                    cube.scale.y = 0.1;
                    webgl.cubes.push(cube);
                    webgl.scene.add(cube);
                    TweenLite.to(cube.scale, 0.3, {x: webgl.cubesDim, y: webgl.cubesDim, z: 1, ease: Expo.easeOut, delay: (j*0.1)+1});
                }
                for (var i = -1; i >= -3; i--) {
                    var cube = new Cube(1, 1, 1);
                    cube.position.set(j*150, i*150, 0);
                    cube.scale.x = 0.1;
                    cube.scale.y = 0.1;
                    webgl.cubes.push(cube);
                    webgl.scene.add(cube);
                    TweenLite.to(cube.scale, 0.3, {x: webgl.cubesDim, y: webgl.cubesDim, z: 1, ease: Expo.easeOut, delay: (j*0.1)+1});
                }
            }
            
        }

        function addZCubes() {
            var i = 0;
            for (i = 0; i < webgl.cubes.length; i++) {
                TweenLite.to(webgl.cubes[i].scale, 0.8, {z: 100, delay: 5, onComplete: function() {
                    webgl.hoverInteraction = false;
                    webgl.cubesRotation = true;
                }});
            }
        }

        function rotateCubes() {
            
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
        if (this.hoverInteraction) {
            this.cubesHoverEffects();
        }
        if (this.cubesRotation) {
            this.rotateCubes();
        }
    };

    Webgl.prototype.rotateCubes = function() {
        var i = 0;
        for (i = 0; i < webgl.cubes.length; i++) {
            webgl.cubes[i].rotation.x += 0.1;
        }
    }

    Webgl.prototype.cubesHoverEffects = function() {
        // find intersections

        // create a Ray with origin at the mouse position
        //   and direction into the scene (camera direction)
        var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1).unproject(this.camera);
        var ray = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());

        // create an array containing all objects in the scene with which the ray intersects
        var intersects = ray.intersectObjects(this.scene.children, true);
        
        // if there is one (or more) intersections
        if (intersects.length > 0)
        {
            // if the closest object intersected is not the currently stored intersection object
            if (intersects[0].object != this.INTERSECTED) 
            {
                if (this.INTERSECTED) {
                    TweenLite.to(this.INTERSECTED.scale, 0.1, {x: 1, y: 1, ease: Bounce.easeOut});
                }
                // store reference to closest object as current intersection object
                this.INTERSECTED = intersects[0].object;
                TweenLite.to(this.INTERSECTED.scale, 0.1, {x: 0.3, y: 0.3});
            }
        } 
        else // there are no intersections
        {
            if (this.INTERSECTED) 
                TweenLite.to(this.INTERSECTED.scale, 0.3, {x: 1, y: 1, ease: Bounce.easeOut});

            this.INTERSECTED = null;
        }
    }

    return Webgl;

})();