loadAPI(1);

host.defineController("Novation", "Launchkey Mini", "1.0", "2ebc4a00-6da2-11e6-bdf4-0800200c9a66");
host.defineMidiPorts(2, 2);
host.addDeviceNameBasedDiscoveryPair(["Launchkey Mini LK Mini MIDI", "Launchkey Mini LK Mini InControl"], ["Launchkey Mini LK Mini MIDI", "Launchkey Mini LK Mini InControl"]);

load("launchkey_common.js");

var statusPlay = false;
var msDate1;
var msDate2;
var ms;
var ms1;
var ms2;




function init() {





    host.getMidiInPort(0).createNoteInput("Keys", "80????", "90????", "B001??", "D0????", "E0????");
    host.getMidiInPort(0).createNoteInput("Pads", "89????", "99????");

    host.getMidiInPort(0).setMidiCallback(onMidi0);
    host.getMidiInPort(1).setMidiCallback(onMidi1);

    transport = host.createTransportSection();

    cursorTrack = host.createCursorTrackSection(0, 8);
    masterTrack = host.createMasterTrackSection(0);

    primaryDevice = cursorTrack.getPrimaryDevice();

    primaryDevice.addSelectedPageObserver(-1, function(value) {
        selectedPage = value;
    });

    primaryDevice.addPageNamesObserver(function() {
        numParameterPages = arguments.length;
    });

    trackBank = host.createTrackBankSection(8, 0, 0);

    for (var p = 0; p < 8; p++) {
        var modSource = primaryDevice.getModulationSource(p);
        modSource.addIsMappingObserver(modSourceStates.setter(p));
    }

    userControls = host.createUserControlsSection(8);

    for (var p = 0; p < 8; p++) {
        userControls.getControl(p).setLabel("User " + (p + 1));
    }

    sendMidi(0x90, 0x0C, 0x7F);
    host.getMidiOutPort(1).sendMidi(0x90, 0x0C, 0x7F);

    updateIndications();

    host.scheduleTask(blinkTimer, null, 100);
}

var fastblink = false;
var blink = false;

function blinkTimer() {
    fastblink = !fastblink;

    if (fastblink) {
        blink = !blink;
    }

    host.scheduleTask(blinkTimer, null, 100);
}

function updateIndications() {
    for (var i = 0; i < 8; i++) {
        primaryDevice.getParameter(i).setIndication(incontrol_knobs);
        userControls.getControl(i).setIndication(!incontrol_knobs);
        primaryDevice.getMacro(i).getAmount().setIndication(incontrol_mix);
        trackBank.getTrack(i).getVolume().setIndication(!incontrol_mix);

    }
}

function exit() {
    sendMidi(0x90, 0x0C, 0x00);
}

function flush() {
    updateOutputState();
    flushOutputState();
}

function onMidi0(status, data1, data2) {
    //printMidi(status, data1, data2);

    if (isChannelController(status)) {
        if (data1 >= 21 && data1 <= 28) {
            var knobIndex = data1 - 21;

            userControls.getControl(knobIndex).set(data2, 128);
        }
        /*
      else if (data1 >= 41 && data1 <= 48)
      {
         var sliderIndex = data1 - 41;

         trackBank.getTrack(sliderIndex).getVolume().set(data2, 128);
      }
      else if (data1 == 7)
      {
         masterTrack.getVolume().set(data2, 128);
      }
      else if (data1 >= 51 && data1 <= 58)
      {
         var buttonIndex = data1 - 51;

         if (data2 == 127)
         {
            trackBank.getTrack(buttonIndex).select();
         }
      }
      */
    }
}

var incontrol_mix = true;
var incontrol_knobs = true;
var incontrol_pads = true;


function onMidi1(status, data1, data2) {
    //printMidi(status, data1, data2);

    if (isChannelController(status)) {
        if (data1 >= 21 && data1 <= 28) {
            var knobIndex = data1 - 21;

            primaryDevice.getParameter(knobIndex).set(data2, 128);

        }

        if (data2 == 127) {
            // button presses

            if (data1 == 106) {
                if (incontrol_mix) {
                    cursorTrack.selectPrevious();
                } else {
                    trackBank.scrollTracksPageUp();
                }
            } else if (data1 == 107) {
                if (incontrol_mix) {
                    cursorTrack.selectNext();
                } else {
                    trackBank.scrollTracksPageDown();
                }
            }

            if (data2 == 104) {
                if (incontrol_mix) {
                    cursorTrack.selectNext();
                } else {
                    trackBank.scrollTracksPageUp();
                }
            } else if (data1 == 105) {
                if (incontrol_mix) {
                    cursorTrack.selectPrevious();
                } else {
                    trackBank.scrollTracksPageUp();
                }
            }
        }
    }

    if (MIDIChannel(status) === 0 && isNoteOn(status))

    /* if (status == 144)
      {
         msDate1 = new Date();
         ms1 = ((msDate1.getSeconds() * 1000) + msDate1.getMilliseconds());
      }

      if (status == 128)
   {
      msDate2 = new Date();
      ms2 = ((msDate2.getSeconds() * 1000) + msDate2.getMilliseconds());
      ms = ms2 - ms1;
   } */


    {
        //host.showPopupNotification(this.status & 0xF);


        if (data1 == 96) // Play
        {
            /*if (statusPlay == false)
         {
            statusPlay = true;
         }
         else
         {
            statusPlay = false;
         }

         */

            transport.play();

            host.showPopupNotification("fdfdf");


        }

        if (data1 == 97) {
            transport.stop();

        }

        if (data1 == 98) {
            transport.rewind();

        }

        if (data1 == 99) {
            transport.fastForward();
        }

        if (data1 == 100) {
            transport.toggleLoop();
        }

        if (data1 == 101) {

        }

        if (data1 == 102) {
            transport.toggleClick();
        }

        if (data1 == 103) {
            transport.tapTempo();
        }

        if (data1 == 112) {
            transport.togglePlay();
        } else if (data1 == 104) {
            var i = data1 - 104;
            primaryDevice.setParameterPage(i);
            primaryDevice.nextParameterPage();
        } else if (data1 == 120) {
            transport.record();

            /*var i = data1 - 120;
         primaryDevice.setParameterPage(i);
         primaryDevice.previousParameterPage();*/
        }

        /*
      if (data1 == 13)
      {
         incontrol_knobs = data2 == 127;
         host.showPopupNotification(incontrol_knobs ? "Knobs: Parameters" : "Knobs: User Mappings");
         updateIndications();
      }
      else if (data1 == 14)
      {
         incontrol_mix = data2 == 127;
         host.showPopupNotification(incontrol_mix ? "Sliders: Macros" : "Sliders: Mixer");
         updateIndications();
      }
      else if (data1 == 15)
      {
         incontrol_pads = data2 == 127;
         host.showPopupNotification(incontrol_pads ? "Parameter Page & Modulation" : "Drum Pads");
         updateIndications();
      }
      */
    }
}
