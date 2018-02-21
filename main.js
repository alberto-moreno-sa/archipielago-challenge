window.onload = function() {

    //Check File API support
    if (window.File && window.FileList && window.FileReader) {
        var filesInput = document.getElementById("files");

        filesInput.addEventListener("change", function(event) {

            var files = event.target.files; //FileList object
            var output = document.getElementById("result");

            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                //Only plain text
                if (!file.type.match('plain')) continue;

                var picReader = new FileReader();

                picReader.addEventListener("load", function(event) {
                    var textFile = event.target.result.split("\n");
                    var map = transformData(textFile);
                    var total = calculate(map);

                    for (var count = 0; count < total.length; count ++) {
                    		var element = document.createElement('div');
                        element.innerText = total[count];
                        output.appendChild(element);
                    }
                });

                //Read the text file
                picReader.readAsText(file);
            }

        });
    }
    else {
        console.log("Your browser does not support File API");
    }
}


function transformData(textFile) {
	var data =  [];
  for (var count = 0; count < textFile.length; count++) {
    lineText = textFile[count].split(" ");

    data.push([parseFloat(lineText[0]), parseFloat(lineText[1])]);
  }

  return data;
}

function calculate(map) {
	var testCase = parseFloat(map[0]);
  var total = [];
  var count = 0;
  var y = 0;
 	var island = [];

	if (testCase < 1 || testCase > 50) {
  	return 'No se puede realizar el calculo lso casos deben ser mayores a 1 pero menores a 50';
  }

  for (var i = 2; i < map.length; i++) {
    if (isNaN(map[i][1])){
      total.push(getArchipelagos(island));
      island=[];
    }

    island.push(map[i]);
  }

  return total;
}

function getArchipelagos(islads) {
  var result = [];
  var lines = [];
  var lisLine = generateLines(islads, 2, 0, result, lines);

  var groupLines = grupByDistance(lisLine);
  var combineLines = [];
  for (var key in groupLines) {
    result = [];
    lines = [];

    combineLines.push(combineLiness(groupLines[key], 2, 0, result, lines));
  }

  var total = 0;
  for (var key2 in combineLines) {
		for (var count = 0; count < combineLines[key2].length; count++) {
    	var combLine = combineLines[key2][count];
      if (shareSamePoint(combLine[0], combLine[1])) {
          total ++;
       }
    }
  }

  return total;
}

function shareSamePoint(lineA, lineB) {
  if (JSON.stringify(lineA.islandA) === JSON.stringify(lineB.islandA)) {
    return true;
  }

  if (JSON.stringify(lineA.islandA) === JSON.stringify(lineB.islandB)) {
    return true;
  }

  if (JSON.stringify(lineA.islandB) === JSON.stringify(lineB.islandA)) {
    return true;
  }

  if (JSON.stringify(lineA.islandB) === JSON.stringify(lineB.islandB)) {
    return true;
  }

  return false;
}

function generateLines(arr, len, startPosition, result, lines) {
	if (len === 0) {
  	lines.push({
    	distance: getDistance(result[0], result[1]),
      islandA: {
        x: result[0][0],
        y: result[0][1]
      },
      islandB: {
        x: result[1][0],
        y: result[1][1]
      },
    });

    return;
  }

  for (var i = startPosition; i <= arr.length - len; i++) {
    result[len - 1] = arr[i];
    generateLines(arr, len - 1, i + 1, result, lines);
  }

  return lines;
}

function getDistance(pointA, pointB) {
	return Math.sqrt(Math.pow((pointB[0] - pointA[0]),2) + Math.pow((pointB[1] - pointA[1]),2));
}

function grupByDistance(lines) {
	return lines.reduce(function(group, item) {
  	var val = item.distance;
    group[val] = group[val] || [];
    group[val].push(item);

    return group;
  }, {});
}

function combineLiness(arr, len, startPosition, result, lines) {
	if (len === 0) {
  	lines.push([result[0], result[1]]);

    return;
  }

  for (var i = startPosition; i <= arr.length - len; i++) {
    result[len - 1] = arr[i];
    combineLiness(arr, len - 1, i + 1, result, lines);
  }

  return lines;
}