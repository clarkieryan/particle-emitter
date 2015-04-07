window.onload = function(){

	var c=document.getElementById("myCanvas");
	var ctx=c.getContext("2d");
	//Create a new instance
	var ps = new ParticleSystem();

	//Set up the drawing loop
	var draw = function(progress){
	    var currentTime = Date.now();
	    timeDelta = currentTime - previousTime;
	    previousTime = currentTime;
	    
	    ctx.clearRect(0, 0, 600, 400);
	    ctx.fillRect(0, 0, 600, 400);

	    ps.update(timeDelta);
	    ps.draw(ctx);
	    window.requestAnimationFrame(draw);
	}

	var previousTime = Date.now();
	window.requestAnimationFrame(draw);

	$(document).foundation({
		slider: {
			on_change: function(){
			ps.updateSettings({
				defaultSprites: $('#sprite-amount').attr('data-slider'),
				radius: $('#sprite-radius').attr('data-slider')/10,
				gravity: {
					y: $('#sprite-gravity').attr('data-slider')/100,
					x:0
				}
			})
			}
		}
	});

}
