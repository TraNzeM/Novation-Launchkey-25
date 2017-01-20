
var ledstate = initArray(-1, 18);
var pendingLedstate = initArray(0, 18);

var selectedPage = 0;
var numParameterPages = 0;

function mixColour(red, green, blink)
{
   return (blink ? 8 : 12) | red | (green * 16);
}

function updateOutputState()  // set color
{
   /* for(var i=0; i<8; i++)
   {
      pendingLedstate[i] = (selectedPage == i)
         ? mixColour(3, 3, false)
         : (i < numParameterPages) ? mixColour(1, 1, false) : 0;


      var j = i + 9;

      pendingLedstate[j] = (modSourceStates.values[i])
         ? (blink ? mixColour(1, 3, false) : mixColour(0, 1, false))
         : 0;
   }
  */

pendingLedstate[17] = 15; // bottom round

if (statusPlay === false) {
    pendingLedstate[0] = 45;
} else {
    pendingLedstate[0] = 15 ?
        (blink ? mixColour(1, 3, false) : mixColour(0, 1, false)) :
        0;
}

pendingLedstate[1] = 62; // stop
pendingLedstate[2] = 29; // rewind
pendingLedstate[3] = 29; // forward
pendingLedstate[4] = 39; // loop
pendingLedstate[5] = 0;
pendingLedstate[6] = 13; // Click On / Off
pendingLedstate[7] = 0x3D; // tapTempo
pendingLedstate[8] = 0;  // top round
pendingLedstate[9] = 45; //togglePlay
}



function flushOutputState()
{
   for(var i=0; i<9; i++)
   {
      if (pendingLedstate[i] != ledstate[i])
      {
         ledstate[i] = pendingLedstate[i];
         host.getMidiOutPort(1).sendMidi(0x90, 96 + i, ledstate[i]);
      }

      var j = i + 9;
      if (pendingLedstate[j] != ledstate[j])
      {
         ledstate[j] = pendingLedstate[j];
         host.getMidiOutPort(1).sendMidi(0x90, 112 + i, ledstate[j]);
      }
   }
}



/* Simple buffer array with setter. */

function BufferedElementArray(initialVal, count)
{
   this.values = initArray(initialVal, count);
}

/* Return a setter function for the specific index. */
BufferedElementArray.prototype.setter = function(index) {
    var obj = this;

    return function(data) {
        obj.set(index, data);
    };
};

BufferedElementArray.prototype.set = function(index, data)
{
   this.values[index] = data;
};

var modSourceStates = new BufferedElementArray(false, 8);
