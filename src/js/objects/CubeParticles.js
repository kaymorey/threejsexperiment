var CubeParticles = (function(){

    function CubeParticles() {
        THREE.Object3D.call(this);
        
        this.particles = 8000;
        this.rotate = false;
        this.colors = [new THREE.Color(0x113F59), new THREE.Color(0x19BEC0), new THREE.Color(0xF3EDD3), new THREE.Color(0xD54F58), new THREE.Color(0x444444)];

        var geometry = new THREE.BufferGeometry();

        var positions = new Float32Array( this.particles * 3 );
        var colors = new Float32Array( this.particles * 3 );

        var color = new THREE.Color();

        var n = 300, n2 = n / 2; // particles spread in the cube

        for ( var i = 0; i < positions.length; i += 3 ) {

            // positions

            var x = Math.random() * n - n2;
            var y = Math.random() * n - n2;
            var z = Math.random() * n - n2;

            positions[ i ]     = x;
            positions[ i + 1 ] = y;
            positions[ i + 2 ] = z;

            // colors

            colors[ i ]     = 102 / 255;
            colors[ i + 1 ] = 102 / 255;
            colors[ i + 2 ] = 102 / 255;

        }

        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

        geometry.computeBoundingSphere();

        //

        var material = new THREE.PointCloudMaterial( { size: 10, vertexColors: THREE.VertexColors } );

        this.particleSystem = new THREE.PointCloud( geometry, material );
        this.add(this.particleSystem);
    }

    CubeParticles.prototype = new THREE.Object3D;
    CubeParticles.prototype.constructor = CubeParticles;

    CubeParticles.prototype.explode = function() {
        var cubeParticles = this;

        var positions = this.particleSystem.geometry.attributes.position.array;

        var n = window.innerWidth, n2 = n / 2;

        var newPositions = new Float32Array( this.particles * 3 );
        for(var i = 0; i < newPositions.length; i += 3) {
            var x = Math.random() * n - n2;
            var y = Math.random() * n - n2;
            var z = Math.random() * n - n2;

            newPositions[ i ]     = x;
            newPositions[ i + 1 ] = y;
            newPositions[ i + 2 ] = z;
        }
        
        newPositions.onComplete = function() {
            cubeParticles.rotate = true;
        };
        TweenLite.to(this.particleSystem.geometry.attributes.position.array, 5, newPositions);
        window.setInterval(function() {
            TweenLite.to(cubeParticles.rotation, 1, {y: 100, ease: Expo.easeOut});
            webgl.renderer.setClearColor(0xF3EDD3);
            window.setTimeout(function() {
                webgl.renderer.setClearColor(0x19bec0);
            }, 1500);
        }, 12000);
    }

    CubeParticles.prototype.changeColors = function() {
        var colors = this.particleSystem.geometry.attributes.color.array;

        var newColors = new Float32Array( this.particles * 3 );
        for(var i = 0; i < newColors.length; i += 3) {
            var newColor = this.colors[Math.floor(Math.random() * this.colors.length)];

            newColors[ i ]     = newColor.r;
            newColors[ i + 1 ] = newColor.g;
            newColors[ i + 2 ] = newColor.b;
        }

        this.particleSystem.geometry.attributes.color.array = newColors;
    }

    CubeParticles.prototype.update = function() {
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        this.particleSystem.geometry.attributes.color.needsUpdate = true;

        this.changeColors();

        if (this.rotate) {
            this.rotation.y += 0.005;
        }
    }

    return CubeParticles;

})();
