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

function makeNoteFromArray(notearray) {
  //for an array that's a single note only
  var step = notearray[0][0]
  if (notearray[0][1] == '#')
    var alter = '1'
  else if (notearray[0][1] == 'b')
    var alter = '-1'
  else 
    var alter = '0'
  if (notearray[1] == 1)
    var type = 'quarter'
  else if (notearray[1] == 2)
    var type = 'half'
  var octave = '4'
  var staff = '1'
  return makenote(step, octave, type, staff, alter)

}


function padNotes(notes) {
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


var firstnote = makenote('D','4','quarter','1','0')
var secondnote = makenote('E','4','quarter','1','1')
var thirdnote = makenote('F','4','quarter','1','-1')
var fourthnote = makenote('G','4','quarter','2','0')

var notes = [firstnote,secondnote,thirdnote]

var secondnotes = [fourthnote]

var onemeasure = [firstmeasure('2','4',notes,'2'),normalMeasure(secondnotes,'2')]

var gClef = clef('G','1','2')

var doc = XMLDoc(onemeasure)
console.log(renderHTML(doc))




function convert(arrayOfNotes) {
  for (var i=0; i<arrayOfNotes.length; i++) {

  }

}


// return [tag('measure',[tag('attributes',[tag('key',[tag('fifths',[keyFifths])]),tag('time',[tag('beats',[beats])])]),
  // notes[0],notes[1],notes[2],notes[3],notes[4],notes[5],notes[6],notes[7]],{'number':'1'})]


// var simplemeasure = [tag('measure',[tag('attributes',[tag('key',[tag('fifths',['2'])]),tag('time',[tag('beats',['4'])])]),
//   tag('note',[tag('pitch',[tag('step',['D']),tag('octave',['4'])]),tag('type',['quarter']),tag('staff',['1'])])],{'number':'1'})]

//var notfirstmeasure = [tag('measure',
 // [tag('note',[tag('pitch',[tag('step',['D']),tag('octave',['4'])]),tag('type',['quarter']),tag('staff',['1'])])],{'number':'1'})]

// var body = [tag('time',
//             [tag('note', ['g'])])];
//var onemeasure = simplemeasure //  firstmeasure('2','4',firstnote,secondnote)


//console.log(renderHTML(notes[0]))

// var simplemeasure = [tag('measure',[tag('attributes',[tag('key',[tag('fifths',['2'])]),tag('time',[tag('beats',['4'])])]),
//   firstnote],{'number':'1'})]

// function padNotes(notes) {
//     for (i=0; i<8; i++) {
//     if (notes[i] == undefined)
//       notes[i] == null
//   }
//   return notes
// }


var par1 = dom('P',[],'hello this is a paragraph')

var test1 = dom('time',[],dom('note',[],'g'))
var par = tag('P')
document.body.appendChild(par1)
// var simplemeasure = [tag('measure',[tag('attributes',[tag('key',[tag('fifths',['2'])])])],{'number':'1'})]

//var onemeasure = [tag('measure',
 // [tag('note',[tag('pitch',[tag('step',['D']),tag('octave',['4'])]),tag('type',['quarter']),tag('staff',['1'])])],{'number':'1'})]

