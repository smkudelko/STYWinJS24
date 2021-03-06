﻿// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var canvas;
    var ctx;
    var w, h;

    //store the different touch points and each event 
    var currTouches = {};
    //store the last x,y value of the event for a particular touch point
    var lastLocation = [];

    var markedForRemoval = [];

    WinJS.UI.Pages.define("/pages/artboard/artboard.html", {

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

        canvas = document.getElementById("artboard");

        ctx = canvas.getContext("2d");
        w = canvas.attributes['width'].value;
        h = canvas.attributes['height'].value;

        ctx.lineWidth = STYWin.SessionState.brushSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.strokeStyle = "black";

        clearArtBoard();

        init();

        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />
            /// <param name="viewState" value="Windows.UI.ViewManagement.ApplicationViewState" />
            /// <param name="lastViewState" value="Windows.UI.ViewManagement.ApplicationViewState" />

            // TODO: Respond to changes in viewState.
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        }

    });


    function clearArtBoard() {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h);
    }


    function setBrushSize(evt) {
        evt.preventDefault();

        ctx.lineWidth = evt.target.winControl.datasize;

        STYWin.SessionState.brushSize = ctx.lineWidth;

        STYWin.AppBar.hide();
    }


    function init() {
        canvas.addEventListener("MSPointerDown", startCapturePoints, false);
        canvas.addEventListener("MSPointerUp", stopCapturePoints, false);
        canvas.addEventListener("MSPointerMove", capturePoints, false);

        document.getElementById("cmdBrushSize5")
            .addEventListener("click", setBrushSize, false);
        document.getElementById("cmdBrushSize10")
            .addEventListener("click", setBrushSize, false);
        document.getElementById("cmdBrushSize15")
            .addEventListener("click", setBrushSize, false);
        document.getElementById("cmdBrushSize20")
            .addEventListener("click", setBrushSize, false);
        document.getElementById("cmdBrushSize30")
            .addEventListener("click", setBrushSize, false);
        document.getElementById("cmdBrushSize50")
            .addEventListener("click", setBrushSize, false);


        drawLoop();
    }

    function drawLoop() {
        window.requestAnimationFrame(drawLoop);
        draw();
    }

    function draw() {
        for (var key in currTouches) {

            if (currTouches[key] !== undefined) {

                //in case someone moves the mouse while using touch
                if (lastLocation[key] === undefined)
                    continue;

                ctx.beginPath();

                var events = currTouches[key];
                var currentNumberOfEventsForThisTouchPoint = events.length;
                for (var i = 0; i < currentNumberOfEventsForThisTouchPoint; i++) {
                    var evt = events[i];
                    var rp = evt.currentPoint.rawPosition;

                    ctx.moveTo(lastLocation[key].x, lastLocation[key].y);
                    ctx.lineTo(rp.x, rp.y);
                    ctx.stroke();

                    //store this point as the last point for this touch location
                    lastLocation[evt.pointerId] = { "x": rp.x, "y": rp.y };
                }
                events.splice(0, currentNumberOfEventsForThisTouchPoint);

                ctx.closePath();
            }
        }

        for (var idx = 0; idx < markedForRemoval.length; idx++) {
            var k = markedForRemoval[idx];

            delete lastLocation[k];
            delete currTouches[k];
        }

        //clear out those marked
        markedForRemoval = [];
    }

    function startCapturePoints(evt) {
        //don't process if it is a mouse, but not a left click
        if (evt.pointerType === evt.MSPOINTER_TYPE_MOUSE && evt.button !== 0)
            return;

        evt.preventDefault();

        var key = evt.pointerId.toString();
        if (!currTouches.hasOwnProperty(key)) {
            currTouches[evt.pointerId.toString()] = [];
        }

        currTouches[evt.pointerId.toString()].push(evt);

        canvas.msSetPointerCapture(evt.pointerId);

        //store the first point as the last location
        lastLocation[evt.pointerId] = {
            "x": evt.currentPoint.rawPosition.x,
            "y": evt.currentPoint.rawPosition.y
        };
    }

    function capturePoints(evt) {
        evt.preventDefault();

        var key = evt.pointerId.toString();
        if (currTouches[key] === undefined) {
            currTouches[evt.pointerId.toString()] = [];
        }

        currTouches[evt.pointerId.toString()].push(evt);
    }

    function stopCapturePoints(evt) {
        evt.preventDefault();

        canvas.msReleasePointerCapture(evt.pointerId);

        markedForRemoval.push(evt.pointerId.toString());
    }

})();
