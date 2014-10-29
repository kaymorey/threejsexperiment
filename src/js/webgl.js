var Webgl = (function(){

    function Webgl(width, height){
        webgl = this;

        // Basic three.js setup
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
        this.camera.position.z = 300;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x19bec0);

        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));

        glitchPass = new THREE.GlitchPass();
        glitchPass.renderToScreen = true;
        this.composer.addPass(glitchPass);
        this.glichEffect = false;


        // Light
        var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );

        this.light = new THREE.PointLight(0xffffff, 100, 1200);
        this.light.add( new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xff0040 })));
        this.light.position.set(0, 0, 350);
        this.scene.add(this.light);

        this.ambientLight = new THREE.AmbientLight(0x444444);
        this.scene.add(this.ambientLight);

        // Global variables
        this.mouse = { x: 0, y: 0 };
        this.INTERSECTED;

        this.counter = 200;
        this.hoverInteraction = false;
        this.cubesRotation = false;
        this.cubes = [];
        this.cubesDim = 100;
        this.psreadParticles = false;

        // Display first cube
        var cube = new Cube(1, 1, 1);
        cube.scale.y = 10;
        cube.position.set(-this.cubesDim/2, -this.cubesDim/2 , 0);
        this.scene.add(cube);
        this.cubes = [cube];

        TweenLite.to(cube.scale, 0.8, {x: this.cubesDim, ease: Expo.easeIn});

        TweenLite.to(cube.position, 0.8, {x: 0, ease: Expo.easeIn});

        TweenLite.to(cube.scale, 0.8, {y: this.cubesDim, delay: 0.8, ease: Expo.easeOut});

        TweenLite.to(cube.position, 0.8, {y: 0, delay: 0.8, ease: Expo.easeOut, onComplete: function() {
            animateTwoSquares();
        }});

        // Display two other cubes
        this.cubes.push(new Cube(1, 1, 1), new Cube(1, 1, 1));
        this.cubes[1].scale.x = this.cubesDim;
        this.cubes[1].scale.y = this.cubesDim;
        this.cubes[2].scale.x = this.cubesDim;
        this.cubes[2].scale.y = this.cubesDim;

        function animateTwoSquares() {
            webgl.scene.add(webgl.cubes[1]);
            webgl.scene.add(webgl.cubes[2]);

            TweenLite.to(webgl.cubes[1].position, 0.8, {x: -150, ease: Expo.easeOut});

            TweenLite.to(webgl.cubes[2].position, 0.8, {x: 150, ease: Expo.easeOut, onComplete: function() {
                awayCamera();  
            }});
        }

        function awayCamera() {
            TweenLite.to(webgl.camera.position, 0.8, {z: 1000, ease: Expo.easeOut, onComplete: function() {
                displayHorizontalCubes();
                popCubes(3, 8);
                popCubes(9, 14);
                displayVerticalCubes();
                webgl.hoverInteraction = true;
                window.setTimeout(function() {
                    $('div.title').fadeIn('slow');
                }, 2000);
                
            }});
        }

        $(document).on('click', 'a.next', function(e) {
            e.preventDefault();
            $(this).fadeOut();
            $('h1.first').fadeOut();
            $('h1.second').fadeIn('slow');
            window.setTimeout(function() {
                $('h1.second').fadeOut('slow', function() {
                    $('h1.third').fadeIn();
                    addZCubes();
                    window.setTimeout(function() {
                        $('h1.third').fadeOut('slow');
                    }, 3000);
                });   
            }, 1000);         
        });

        function popCubes(minIndex, maxIndex) {
            var j = 0;
            for (var i = minIndex; i <= maxIndex; i++) {
                var cube = webgl.cubes[i];
                webgl.scene.add(cube);
                TweenLite.to(cube.scale, 0.3, {x: webgl.cubesDim, y: webgl.cubesDim, z: 1, ease: Expo.easeOut, delay: j*0.1, onStart:function() {
                    document.getElementById('pop').play();
                }});
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
                    TweenLite.to(cube.scale, 0.3, {x: webgl.cubesDim, y: webgl.cubesDim, z: 1, ease: Expo.easeOut, delay: (j*0.1)+1, onStart: function() {
                        document.getElementById('pop').play();
                    }});
                }
                for (var i = -1; i >= -3; i--) {
                    var cube = new Cube(1, 1, 1);
                    cube.position.set(j*150, i*150, 0);
                    cube.scale.x = 0.1;
                    cube.scale.y = 0.1;
                    webgl.cubes.push(cube);
                    webgl.scene.add(cube);
                    TweenLite.to(cube.scale, 0.3, {x: webgl.cubesDim, y: webgl.cubesDim, z: 1, ease: Expo.easeOut, delay: (j*0.1)+1, onStart: function() {
                        document.getElementById('pop').play();
                    }});
                }
            }
            
        }

        function addZCubes() {
            var i = 0;
            for (i = 0; i < webgl.cubes.length; i++) {
                TweenLite.to(webgl.cubes[i].scale, 1, {x: 100, y: 100, z: 100, delay: 0.4, ease: Expo.easeOut, onStart: function() {
                    webgl.hoverInteraction = false;
                },
                onComplete: function() {
                    window.setTimeout(function() {
                        webgl.cubesRotation = true;
                        document.getElementById('c2c').play();
                        moveLight();
                    }, 500);
                }});
            }
        }

        function moveLight() {
            TweenLite.to(webgl.light.position, 1, {x: 0, y: -100, z: 50});
            webgl.light.intensity = 200;
        }

    }

    Webgl.prototype.resize = function(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    };

    Webgl.prototype.render = function() {    
        this.renderer.render(this.scene, this.camera);

        if (this.spreadParticles) {
            this.cubeParticles.update();
        }

        if (this.glichEffect) {
            this.composer.render();
        }

        if (this.hoverInteraction) {
            this.cubesHoverEffects();
        }
        if (this.cubesRotation) {
            this.rotateCubes();
        }
    };

    Webgl.prototype.rotateCubes = function() {
        if (this.counter % 200 == 0) {
            this.rotationSpeed = this.counter / 200 * 0.01;
        }
        var i = 0;
        for (i = 0; i < webgl.cubes.length; i++) {
            webgl.cubes[i].rotation.x += this.rotationSpeed;
        }

        if (this.counter == 1000) {
            this.moveCubesToCenter();
            this.counter = -1
        }
        
        if (this.counter >= 0) {
            this.counter += 1;
        }
    }

    Webgl.prototype.moveCubesToCenter = function() {
        for (i = 0; i < this.cubes.length; i++) {
            TweenLite.to(this.cubes[i].position, 7, {x: 0, y: 0, z: 0, ease: Quad.easeIn, delay: i*0.03});
            TweenLite.to(this.cubes[i].rotation, 1, {z: -10, ease: Quad.easeIn, delay: i*0.03});
        }
        window.setTimeout(function() {
            webgl.removeAllCubesButFirst();
            TweenLite.to(webgl.cubes[0].rotation, 1, {z: 0, ease: Quad.easeIn});
        }, 10150);
    }

    Webgl.prototype.removeAllCubesButFirst = function() {
        for (i = 1; i < this.cubes.length; i++) {
            this.scene.remove(this.cubes[i]);
        }
        var firstCube = this.cubes[0];
        this.cubes = [firstCube];
        webgl.growCube();
    }

    Webgl.prototype.growCube = function() {
        TweenLite.to(this.cubes[0].scale, 0.8, {x: 300, y: 300, z: 300, ease: Expo.easeIn, onComplete: function() {
            webgl.cubesRotation = false;
            TweenLite.to(webgl.cubes[0].rotation, 1.2, {x: 0, onComplete: function() {
                window.setTimeout(function() {
                    webgl.scene.remove(webgl.cubes[0]);

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
                    TweenLite.to(this.INTERSECTED.scale, 0.1, {x: 1, y: 1});
                    TweenLite.to(this.INTERSECTED.rotation, 0.1, {z: 0});
                }
                // store reference to closest object as current intersection object
                this.INTERSECTED = intersects[0].object;
                TweenLite.to(this.INTERSECTED.scale, 0.1, {x: 1.4, y: 1.4});
                TweenLite.to(this.INTERSECTED.rotation, 0.1, {z: 10});
            }
        } 
        else // there are no intersections
        {
            if (this.INTERSECTED) {
                TweenLite.to(this.INTERSECTED.scale, 0.3, {x: 1, y: 1});
                TweenLite.to(this.INTERSECTED.rotation, 0.1, {z: 0});
            }

            this.INTERSECTED = null;
        }
    }

    return Webgl;

})();