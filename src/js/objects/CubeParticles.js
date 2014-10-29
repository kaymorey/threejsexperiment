var CubeParticles = (function(){

    function CubeParticles() {
        THREE.Object3D.call(this);
        
        this.particles = 8000;

        var geometry = new THREE.BufferGeometry();

        var positions = new Float32Array( this.particles * 3 );
        var colors = new Float32Array( this.particles * 3 );

        var color = new THREE.Color();

        var n = 100, n2 = n / 2; // particles spread in the cube

        for ( var i = 0; i < positions.length; i += 3 ) {

            // positions

            var x = Math.random() * n - n2;
            var y = Math.random() * n - n2;
            var z = Math.random() * n - n2;

            positions[ i ]     = x;
            positions[ i + 1 ] = y;
            positions[ i + 2 ] = z;

            // colors

            var vx = ( x / n ) + 0.5;
            var vy = ( y / n ) + 0.5;
            var vz = ( z / n ) + 0.5;

            color.setRGB( vx, vy, vz );

            colors[ i ]     = color.r;
            colors[ i + 1 ] = color.g;
            colors[ i + 2 ] = color.b;

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
        var positions = this.particleSystem.geometry.attributes.position.array;

        var n = window.innerWidth / 2, n2 = n / 2;

        var newPositions = new Float32Array( this.particles * 3 );
        for(var i = 0; i < newPositions.length; i += 3) {
            var x = Math.random() * n - n2;
            var y = Math.random() * n - n2;
            var z = Math.random() * n - n2;

            newPositions[ i ]     = x;
            newPositions[ i + 1 ] = y;
            newPositions[ i + 2 ] = z;
        }
        console.log(this.particleSystem.geometry.attributes.position.array);
        var test = this;
        newPositions.onComplete = function() {
            console.log(test.particleSystem.geometry.attributes.position.array);
        };
        TweenLite.to(this.particleSystem.geometry.attributes.position.array, 50, newPositions); //tween the values of a to those of b over 2 seconds, and log them to the console.

    };

    CubeParticles.prototype.update = function() {
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    return CubeParticles;

})();
