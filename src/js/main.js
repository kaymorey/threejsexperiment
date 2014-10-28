var webgl, gui;

$(document).ready(init);

function init(){
    webgl = new Webgl(window.innerWidth, window.innerHeight);
    $('.three').append(webgl.renderer.domElement);

    gui = new dat.GUI();
    //gui.add(webgl.triangle.rotation, 'x').min(-Math.PI).max(Math.PI);
    gui.close();

    $(window).on('resize', resizeHandler);
    // when the mouse moves, call the given function
    $(window).on('mousemove', onDocumentMouseMove);

    animate();
}

function resizeHandler() {
    webgl.resize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    // the following line would stop any other event handler from firing
    // (such as the mouse's TrackballControls)
    // event.preventDefault();
    
    // update the mouse variable
    webgl.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    webgl.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
    requestAnimationFrame(animate);
    webgl.render();
    webgl.update();
}