// function stepConverter(step) {
//     var dict = {'C':0, 'D':2, 'E':4,'F':5,'G':7,'A':9,'B':11}
//     var reversedict = {0: 'C', 2: 'D', 4:'E', 5:'F', 7:'G', 9:'A', 11:'B'}
//     return dict[step]

// }
function $(id) {
    return document.getElementById(id)
}


function testfunction() {
    $('button').innerHTML = make_for_xml(2,'B',5,4,4)
}

// function ajaxtest() {
//     $('button').load('xml_sightreading_test.txt')
// }

var notesArray = ['C','D','F','G','A','B']

var majorScale =  [0,2,4,5,7,9,11]
var minorScale = [0,2,3,5,7,8,10]

var fiveFingerMajor = [0,2,4,5,7]
var fiveFingerMinor = [0,2,3,5,7]

function Note(step, octave, alter, rhythmType) {
    this.step = step
    this.octave = octave
    this.alter = alter
    this.rhythmType = rhythmType
    this.halfSteps = (stepConverter(step) + this.alter)%12
}

Note.prototype.scaleDegree = function(tonic) {
    //input key as number 0-11?
    var degrees = MajorScale(tonic).steps
    var note = this.halfSteps
    if (degrees.indexOf(note) != -1)
        return degrees.indexOf(note)

}

function MajorScale(tonic, step, fifthsCircle) {
    //tonic as 0-11
    var reversedict = {0: 'A', 2: 'B', 3:'C', 5:'D', 7:'E', 8:'F', 10:'G'}
    var notesList = ['A','B','C','D','E','F','G']
    var majorScaleArray = [0,2,4,5,7,9,11]
    var ind = notesList.indexOf(step)
    //console.log(ind)
    //console.log(notesList[ind])
    //var newNotesList = []
    for (var i = 0; i<ind; i++){
        notesList.push(notesList.shift())
        
    }
    // for (var i=0; i<7; i++)
    //     newNotesList.push(notesList[i+ind])
    // console.log(newNotesList)
    //console.log(notesList)
    this.tonic = tonic
    this.stepNums = []
    this.stepNames = {}
    for (var i=0; i<7; i++)
        this.stepNums.push((majorScaleArray[i]+tonic)%12)
    //if (fifthsCircle <= 6) {
    for (var i=0; i<7; i++) {
        if (!reversedict[this.stepNums[i]] && fifthsCircle <= 6)
            this.stepNames[i+1] = notesList[i] + '#'
        else if (!reversedict[this.stepNums[i]] && fifthsCircle > 6)
            this.stepNames[i+1] = notesList[i] + 'b'
        else
            this.stepNames[i+1] = reversedict[this.stepNums[i]]
            
        }
    
}



function NextStepDegree(currentScaleDegree) {
    //for five finger position only
    var randNum = Math.random()
    if (currentScaleDegree == 1)
        return randNum < 0.3 ? currentScaleDegree : currentScaleDegree+1
    else if (currentScaleDegree == 5)
        return randNum < 0.3 ? currentScaleDegree : currentScaleDegree-1
    else {
        if (randNum <= 0.4)
            return currentScaleDegree-1
        else if (0.4<randNum<0.6)
            return currentScaleDegree
        else return currentScaleDegree + 1
    }
}

function makeRhythms(numMeasures) {
    var rhythms = [];
    for (var i=0; i<numMeasures; i++)
        rhythms.push([])
    var beat = 1;
    var measures = 0;
    while (measures < numMeasures-1) {
        if (beat > 4) {
            beat = beat % 4;
            measures += 1;
        }
        if (beat == 1 || beat == 3) {
            randNum = Math.random();
            if (randNum < 0.5) {
                rhythms[measures].push(1);
                beat += 1;
            }
            else {
                rhythms[measures].push(2);
                beat += 2;
            }
        }
        else if (beat == 2 || beat == 4) {
            rhythms[measures].push(1)
            beat += 1
        }
        //if (rhythms.reduce(function(a,b){return a+b}) == numMeasures*4)
            //break    

    }
    console.log(rhythms)
    return rhythms
}


function makeSteps(rhythms, rhythms_nested) {
    console.log(rhythms)
    console.log(rhythms_nested)
    //var rhythms = makeRhythms(numMeasures)
    //below was to list rhythms out without metrical information, commenting out
    // var len = 0;
    // for (i=0; i<rhythms.length; i++) {
    //     len += rhythms[i].length
    // }
    // var numnotes = len
    // console.log(numnotes)
    var numnotes = rhythms.length
    // var notes = [1]
    // for (var i=0; i<rhythms.length-1; i++) {
    //     notes.push([])
    //     for (var j=0; j<rhythms[i].length; j++) {
    //         notes[i]
    //     }
    // }
    var notes = [1]
    for (var i=1; i<numnotes; i++)
        notes.push(NextStepDegree(notes[i-1]))
    notes.reverse()
    console.log(notes)
    var notes_with_meter = []
    var ind = 0
    for (var i=0; i<rhythms_nested.length; i++) {
        notes_with_meter.push([])
        for (var j=0; j<rhythms_nested[i].length; j++) {
            notes_with_meter[i].push(notes[j+ind])
        }
        ind += rhythms_nested[i].length
    }
    console.log(notes_with_meter)
    return notes_with_meter

}

//need function that takes an array like [[1,3],[2,4],[5,6,7]] 
//and another array of arrays [[2,3],[4,5],[6,4,3]] and makes 
// new array with same structure as second but with a function of each
// element on the first one

// function combineArrays(arrays) {
//     var len = arguments.length
//     var result = []
//     var ind = 0
//     for (var k=0; k<arguments[0].length; k++){
//         result.push([])
//         for (var i=0; i<arguments.length; i++){
//             result[k].push(arguments[i][k])
//         }
//     }
//     return result

// }

//[[3,4],[5,1]],    [[6,7],[8,9]],   [[10,11],[12,13]]

function changeEach(array_of_arrays, func) {
    var result = []
    var ind = 0
    for (var k=0; k<array_of_arrays.length; k++) {
        result.push([])
        for (var i=0; i<array_of_arrays[k].length; i++){
            result[k].push(func(array_of_arrays[k][i]))
        }
        ind += array_of_arrays[k].length
    }
    return result
}



function stepsWithScale(tonic,step,fifthsCircle,rhythms,rhythms_nested) {
    //var rhythms = makeRhythms(numMeasures);
    console.log(rhythms);
    var scale = new MajorScale(tonic,step,fifthsCircle);
    function convertNumToScale(num) {
        return scale.stepNames[num]
    }
    console.log(scale)
    var notes = makeSteps(rhythms, rhythms_nested)
    console.log(notes)
    readnotes = changeEach(notes,convertNumToScale)
    function convertScaleDegreeToKeyboardNumber(num){
        return 48 + majorScale[num-1] + tonic
        
    }
    notesNumbers = changeEach(notes,convertScaleDegreeToKeyboardNumber)   
    console.log(notesNumbers)
    return {noteNumbers: notesNumbers, readnotes: readnotes}
    // console.log(readnotes)
    

    // // var readnotes = []
    // // var ind = 0
    // // for (var k=0; k<notes.length; k++){
    // //     readnotes.push([])
    // //     for (var i=0; i<notes[k].length; i++) {
    // //         readnotes[k].push(scale.stepNames[notes[k][i]])
    // //     }
    // //     ind += notes[k].length
    // // }
    // console.log(readnotes)
    // return readnotes
}

function combineNotesRhythms(tonic,step,fifthsCircle,numMeasures) {
    var rhythms_nested = makeRhythms(numMeasures);
    var rhythms = []
    for (var i=0; i<rhythms_nested.length; i++) {
        for (var j=0; j<rhythms_nested[i].length; j++)
            rhythms.push(rhythms_nested[i][j])
    }
    console.log(rhythms)
        

    var notes = stepsWithScale(tonic,step,fifthsCircle,rhythms,rhythms_nested);
    var notesReadable = notes['readnotes']
    var notesNumbers = notes['noteNumbers']
    // function changeNoteToNoteRhythmAlter(note){
    //     if (note)
    // }
     
    function shaveNote(note) {
        return note[0]
    }
    
    function findAlter(note) {
        if (note[1] == '#')
            var alter = '1'
        else if (note[1] == 'b')
            var alter = '-1'
        else var alter = '0'
        return alter
    }
    function findOctave(note) {
        return Math.floor((note+9)/12)-1

    }
    function convertRhythm(rhythm) {
        if (rhythm == 1)
            return 'quarter'
        else if (rhythm == 2)
            return 'half'
    }
    var rhythmsConverted = changeEach(rhythms_nested,convertRhythm)
    var alters = changeEach(notesReadable,findAlter)
    var notesShaved = changeEach(notesReadable,shaveNote)
    var octaves = changeEach(notesNumbers,findOctave)
    var result = {rhythms: rhythmsConverted, notes: notesShaved, octaves: octaves, alters: alters}
    console.log(result)
    return result

}


console.log(combineNotesRhythms(2,'B',5,4))

function make_for_xml(tonic,step,fifthsCircle,numMeasures,beats) {
    var notes_rhythms = combineNotesRhythms(tonic,step,fifthsCircle,numMeasures)
    var notes = notes_rhythms['notes']
    var rhythms = notes_rhythms['rhythms']
    var alters = notes_rhythms['alters']
    var octaves = notes_rhythms['octaves']


    //firstNotes = makenote(notes_rhythms[0][0][0],'4',notes_rhythms[0][0][1],'1',notes_rhythms[0][0][2])
    var firstNotes = []
    for (var i=0; i<notes[0].length; i++)
        firstNotes.push(makenote(notes[0][i],String(octaves[0][i]),rhythms[0][i],'1',alters[0][i])) 
    var first = firstmeasure(String(fifthsCircle),String(beats),firstNotes,'2')
    var combined = [first]
    console.log(notes)
    for (var k=1; k<notes.length; k++) {
        var measureNotes = [];
        for (var i=0; i<notes[k].length; i++) {
            measureNotes.push(makenote(notes[k][i],String(octaves[k][i]),rhythms[k][i],'1',alters[k][i]))
            console.log(measureNotes.length)
            
        }
        var measure = normalMeasure(measureNotes,'2')
        combined.push(measure)     
    }
    var doc = XMLDoc(combined)
    console.log(renderHTML(doc))
    return renderHTML(doc)
}

var m = make_for_xml(2,'B',5,4,4)

console.log(m)
console.log(String(m))
var xml = '<?xml version="1.0" encoding="UTF-8"?> <!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 2.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">' + String(m)

var encodedXML = encodeURIComponent(xml);
document.getElementById('downloadLink').setAttribute('href','data:text/xml,' + encodedXML);
console.log(xml)

// function selectNextStep(scale, currentStep) {
//     index = scale.indexOf(currentStep);
//     var randNum = Math.random();
//     if (index == 0) 
//         return randNum < 0.5 ? scale[index] : scale[index+1]
//     else if (index == scale.length-1)
//         return randNum < 0.5 ? scale[index] : scale[index-1]
//     else {
//         if (randNum < 0.33)
//             return scale[index-1]
//         else if (0.33 <= randNum < 0.66)
//             return scale[index]
//         else return scale[index+1]
//     }
// }

function setNodeAttribute(node, attribute, value) {
  if (attribute == "class")
    node.className = value;
  else if (attribute == "checked")
    node.defaultChecked = value;
  else if (attribute == "for")
    node.htmlFor = value;
  else if (attribute == "style")
    node.style.cssText = value;
  else
    node.setAttribute(attribute, value);
}

function forEach(arr, func) {
    for (var i=0; i<arr.length; i++)
        func(arr[i])
}


function dom(name, attributes) {
  var node = document.createElement(name);
  if (attributes) {
    forEachIn(attributes, function(name, value) {
      setNodeAttribute(node, name, value);
    });
  }
  for (var i = 2; i < arguments.length; i++) {
    var child = arguments[i];
    if (typeof child == "string")
      child = document.createTextNode(child);
    node.appendChild(child);
  }
  return node;
}

function forEachIn(object, func) {
    for (var property in object) {
        if (object.hasOwnProperty(property))
            func(property, object[property])
    }
}


// function escapeHTML(text) {
//   var replacements = [[/&/g, "&amp;"], [/"/g, "&quot;"],
//                       [/</g, "&lt;"], [/>/g, "&gt;"]];
//   forEach(replacements, function(replace) {
//     text = text.replace(replace[0], replace[1]);
//   });
//   return text;
// }

function renderHTML(element) {
  var pieces = [];

  function renderAttributes(attributes) {
    var result = [];
    if (attributes) {
      for (var name in attributes) 
        result.push(" " + name + "='" +
                    (attributes[name]) + "'");
    }
    return result.join("");
  }

  function render(element) {
    // Text node
    if (typeof element == "string") {
      pieces.push((element));
    }
    else if (element == null) {}
    // Empty tag
    else if (!element.content || element.content.length == 0) {
      pieces.push("<" + element.name +
                  renderAttributes(element.attributes) + "/>");
    }
    // Tag with content
    else {
      pieces.push("<" + element.name +
                  renderAttributes(element.attributes) + ">");
      forEach(element.content, render);
      pieces.push("</" + element.name + ">");
    }
  }

  render(element);
  return pieces.join("");
}

function tag(name, content, attributes) {
  return {name: name, attributes: attributes, content: content};
}

 
function XMLDoc(bodyContent) {
  return tag('score-partwise',[tag('part-list',[tag('score-part',[],{'id':'P1'})]),tag('part',bodyContent,{'id':'P1'})],{'version': '2.0'})
} 



function makenote(step,octave,type,staff,alter) {
  return tag('note',[tag('pitch',[tag('step',[step]),
    tag('octave',[octave]),tag('alter',[alter])]),tag('type',[type]),tag('staff',[staff])])
}

// function makeNoteFromArray(notearray) {
//   //for an array that's a single note only
//   var step = notearray[0][0]
//   if (notearray[0][1] == '#')
//     var alter = '1'
//   else if (notearray[0][1] == 'b')
//     var alter = '-1'
//   else 
//     var alter = '0'
//   if (notearray[1] == 1)
//     var type = 'quarter'
//   else if (notearray[1] == 2)
//     var type = 'half'
//   var octave = '4'
//   var staff = '1'
//   return makenote(step, octave, type, staff, alter)

// }


function padNotes(notes) {
    //makes the first element null to be filled in later if it's the first measure
  copynotes = [];
  for (var i=0; i<notes.length;i++)
    copynotes.push(notes[i])
  if (copynotes[0]!=null) {
    for (var i=copynotes.length; i>0; i--) {
      copynotes[i] = copynotes[i-1];     
    }
    copynotes[0] = null
  }
  return copynotes
    
}



function firstmeasure(keyFifths,beats,notes,numStaves) {
  newnotes = padNotes(notes)
  newnotes[0] = tag('attributes',[clef('G','1','2'),clef('F','2','4'),
    tag('key',[tag('fifths',[keyFifths])]),
    tag('staves',[numStaves]),tag('time',[tag('beats',[beats])])])
  return tag('measure',newnotes,{'number':'1'})
  
}

function normalMeasure(notes,number) {
  console.log(renderHTML(tag('measure',notes,{'number':number})))
  return tag('measure',notes,{'number':number})
}

function clef(clefType, number, lineNumber) {
  return tag('clef',[tag('sign',[clefType]),tag('line',[lineNumber])],{'number':number})
}

