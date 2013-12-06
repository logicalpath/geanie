
function draw()
{
	var canvas = document.getElementById("c1")
	if (canvas.getContext) {
		var c = canvas.getContext("2d");
                c.fillStyle="#95FFAA";
		c.fillRect(32,32,96,96);

		c.globalAlpha = 0.5;
                c.fillStyle="#31D1FF";
		c.fillRect(64,64,96,96);
	 }

}
