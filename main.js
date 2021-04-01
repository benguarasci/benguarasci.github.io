// Globals
// This was taken out of the function for a check being done
var num_trial = 0;
var NB_VALUES = 4;
var rep_check;

function reset_counts() {
	num_trial = 0;
	NB_VALUES = 4;
}

function textTest() {
	start_button.style.display = 'none';
	rep_check = 0;
	main();
}

function barTest() {
	start_button.style.display = 'none';
	rep_check = 1;
	main();
}

function create_table(representation, numValues, values, correct_ans, clicked, time){
	this.representation = representation;
	this.numValues = 'n' + numValues;
	this.values = values;
	this.correct_ans = correct_ans;
	this.clicked = clicked;
	this.time = time;
	
 }
   

function main() {
	var width = 400;
	var height = 400;
	var time_start = new Date();
	
	//toggle bubble chart or text representation
	var REPRESENTATION;
	if(rep_check == 0) {
		REPRESENTATION = "text";
	} else if(rep_check == 1) {
		REPRESENTATION = "bubble";
	}
	
	const MIN_VALUE = 0;
	const MAX_VALUE = 99;
	
	var svg = d3.select("#test_container")
		.append("svg")
		.attr("width", 400)
		.attr("height", 400)
		.style("margin-left", "auto")
		.style("margin-right", "auto")
		.style("display", "block")
		.style("border", "1px solid black");
		
	var values = d3.range(NB_VALUES).map(d => Math.floor(Math.random() * 100)) // the randomly generated set of values between 0 and 99

	var pad = 5 //padding for grid layout (text and bubble)
	var numCol, numRow; // number of columns, number of rows
	var bubble_min_radius, bubble_max_radius;
	var _w, _h;
	
	var font_size;
	
	if(NB_VALUES == 4){
		numCol = 2;
		numRow = 2;
		_w = width/numCol
		_h = height/numRow
	  
		bubble_min_radius = 1;// arbitrary, could be 0, or something else
		bubble_max_radius = (_w/2 - pad*2);
		
		font_size = 48// arbitrary choice
	  }else if(NB_VALUES == 9){
		numCol = 3;
		numRow = 3;
		_w = width/numCol
		_h = height/numRow

		bubble_min_radius = 1;// arbitrary, could be 0, or something else
		bubble_max_radius = (_w/2 - pad*2);
		
		font_size = 48// arbitrary choice
	  }else if(NB_VALUES == 25){
		numCol = 5;
		numRow = 5;
		_w = width/numCol
		_h = height/numRow

		bubble_min_radius = 1;// arbitrary, could be 0, or something else
		bubble_max_radius = (_w/2 - pad*2);
		
		font_size = 48// arbitrary choice
	}
		
	var sign = svg.selectAll('g') // create one group element to display each value, puts it at its position
		.data(values)
		.enter()
		.append('g')
		.attr('transform', function(d, i){
			switch(REPRESENTATION){
			  case 'text':
			  case 'bubble':
				  return 'translate(' + ((i%numCol)*_w + (pad/2)*-1) + ','+ ((Math.floor(i/numRow))*_h + (pad/2)*-1) +')'
				break;
			  case 'bar':
				  return 'translate(' + (i*width/NB_VALUES) + ','+ (height) +')'
				break;
				default: console.error('unknown representation',REPRESENTATION);
			}
		}).on('click', function(d,i){
			var time_click = new Date() - time_start;
			console.log('----------REPRESENTATION1 TRIAL1------------')
			var R1T1 = new create_table(REPRESENTATION, values.length, values.toString(), Math.max.apply(null, values),i, time_click)
			console.table(R1T1)

			d3.select("svg").remove();
			num_trial = num_trial + 1;
			
			if(num_trial == 3) {
				num_trial = 0;
				if(NB_VALUES == 4) {
					NB_VALUES = 9;
				} else if (NB_VALUES == 9) {
					NB_VALUES = 25;
				} else if (NB_VALUES == 25) {
					if(rep_check == 0) {
						d3.select("#task").text("Please copy your results onto your text file and move on to the Bar Graph Trials by clicking the button at the bottom of the page.")
						next_button.style.display = 'block';
					} else if(rep_check == 1) {
						d3.select("#task").text("Please copy your results onto your text file. Then, send it to John Frederick Duco on Slack.\nOnce you are done, please fill in our survey by cliking the button at the bottom of the page.")
						q.style.display = 'block';
					}
					//res_table.style.display = 'table';
					reset_counts();
					return;
				}
			}
			main();
		}).style('cursor','pointer')//make it a pointer on mouseover
	
	if(REPRESENTATION == "text") {
	//create an 'invisible' circle of size half the max size of a bubble, simply to make it possible to click the smaller circles easily.
		sign.append('circle')
			.attr('cx', _w/2)
			.attr('cy', _w/2)
			.attr('r', bubble_max_radius/2)
			.style('fill', 'white')
  
		sign.append('text')
			.attr('x', _w/2)
			.attr('y', _w/2)
			.attr('text-anchor','middle')
			.attr('font-size', font_size+"px")
			.text(d => d)
	} else if(REPRESENTATION == "bubble"){
  
		//that's to create a perceptual scaling by mapping square root of value to radius, but other scaling functions could be used
		var circleRadiusScale = d3.scaleLinear()
			.domain([Math.sqrt(MIN_VALUE), Math.sqrt(MAX_VALUE)])
			.range([bubble_min_radius, bubble_max_radius]);
		
		//create an 'invisible' circle of size half the max size of a bubble, simply to make it possible to click the smaller circles easily.
		sign.append('circle')
		  .attr('cx', _w/2)
		  .attr('cy', _w/2)
		  .attr('r', bubble_max_radius/2)
		  .style('fill', 'white')
	  
		// then, for each cell we appends a circle
		sign.append('circle')
		  .attr('cx', _w/2)
		  .attr('cy', _w/2)
		  .attr('r', d => circleRadiusScale(Math.sqrt(d)))
		  .style('fill','black')
	  }
	else if(REPRESENTATION == 'bar') {
  
		var bar_scale = d3.scaleLinear()
			.domain([MIN_VALUE, MAX_VALUE])
			.range([0, height]);
  
		sign.append('rect')
			.attr('x', 0)
			.attr('y', d => -bar_scale(d))
			.attr('width', width/NB_VALUES)
			.attr('height', d => bar_scale(d))
			.style('fill','black')
			.style('stroke','white')
	}
	return svg.node()
}