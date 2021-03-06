﻿// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    WinJS.strictProcessing();

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            if (args.detail.arguments) {
                var info = document.createElement("div");
                info.innerHTML = toStaticHTML("<p>Launched from secondary tile " +
                        args.detail.tileId + " with the following activation arguments : " +
                        args.detail.arguments + "</p>");
                document.querySelector("body").appendChild(info);
            }
            
            args.setPromise(WinJS.UI.processAll().then(function () {
                STYWin.initAppBar();
            }));

        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();
})();


(function () {
    var secondaryTileId = "LiveTileExample.TileId1";

    WinJS.Namespace.define("STYWin", {
        initAppBar: initAppBar
    });

    function initAppBar() {
        var btnPinAction = document.getElementById("btnPinAction").winControl;
        if (Windows.UI.StartScreen.SecondaryTile.exists(secondaryTileId)) {
            btnPinAction.label = "Unpin from Start";
            btnPinAction.icon = "unpin";
            btnPinAction.tooltip = "Unpin from Start";
            btnPinAction.element.onclick = unpinSecondaryTile;
        } else {
            btnPinAction.label = "Pin to Start";
            btnPinAction.icon = "pin";
            btnPinAction.tooltip = "Pin to Start";
            btnPinAction.element.onclick = pinSecondaryTile;
        }
    }

    function pinSecondaryTile() {

        var found = Windows.Foundation;
        var uriLogo = new found.Uri("ms-appx:///images/logo.png");
        var uriSmallLogo = new found.Uri("ms-appx:///images/smalllogo.png");
        var uriWideLogo = new found.Uri("ms-appx:///images/widelogo.png");

        var currentTime = new Date();

        var newTileActivationArguments = "timeTileWasPinned=" + currentTime;

        var tile = new Windows.UI.StartScreen.SecondaryTile(secondaryTileId,
            "Awesome Secondary Tile Text",
            "LiveTileExample | Content 123",
            newTileActivationArguments,
            Windows.UI.StartScreen.TileOptions.showNameOnWideLogo,
            uriLogo,
            uriWideLogo);

        tile.smallLogo = uriSmallLogo;
        tile.foregroundText = Windows.UI.StartScreen.ForegroundText.dark;

        var btnPinAction = document.getElementById("btnPinAction");
        var selectionRect = btnPinAction.getBoundingClientRect();
        selectionRect.x = selectionRect.left;
        selectionRect.y = selectionRect.top;

        tile.requestCreateForSelectionAsync(selectionRect).done(function (isCreated) {
            if (isCreated) {
                console.log("Secondary tile was pinned successfully.");
            } else {
                console.log("Secondary tile was not pinned.");
            }
            initAppBar();
        });
    }

function unpinSecondaryTile() {

    var start = Windows.UI.StartScreen;
    var tileToGetDeleted = new start.SecondaryTile(secondaryTileId);
    tileToGetDeleted.requestDeleteAsync().done(function (isCreated) {
        if (isCreated) {
            console.log("Secondary tile was unpinned successfully.");
        } else {
            console.log("Secondary tile was not unpinned.");
        }
        initAppBar();
    });
}

})();

