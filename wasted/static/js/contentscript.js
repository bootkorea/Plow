function crosswebex_nativecall(message, callback) {
    const pageurl = document.location.origin + document.location.pathname;
    let EVENT_FROM_PAGE = "__crosswebex__rw_chrome_ext_" + btoa(pageurl);
    let EVENT_REPLY = "__crosswebex__rw_chrome_ext_reply_" + btoa(pageurl);
    if(typeof message.callback == "undefined") {
        message.callback = EVENT_REPLY + "__callback__";
    } else {
        message.callback = EVENT_REPLY + "__callback__" + message.callback;
    }
    if(typeof message.origin != "undefined") {
        message.origin = location.protocol + "//" + encodeURIComponent(location.hostname);
    }
    try {
        if (message.cmd == "setcallback") {
            let transporter = document.getElementById("setcallback");
            let tag_id = "";
            if (transporter == undefined) {
                if(message.exfunc.fname == "new"){
                    let pushcbfname = message.exfunc.args[0].callback;

                    transporter = document.createElement("dummy");
                    transporter.id = "setcallback";

                    tag_id = "_crosswebex_dummy_id_" + new Date().getTime();
                    if (message.id && typeof message.id == "string") tag_id = message.id;
    
                    transporter.setAttribute("tag", tag_id);
                    transporter.addEventListener(EVENT_REPLY, function (event) {
                        let result = this.getAttribute("result");
                        let tagid = this.getAttribute("tag");
                        result = JSON.parse(result);
                        let cbfunction = result.callback;
                        let idx = cbfunction.indexOf("_setcallback_");
                        if (idx > -1) {
                            let _tagid = cbfunction.substr(idx + 13);
                            if (_tagid != tagid) return;
                            if (typeof document.activeElement.contentDocument != "undefined" || (document.activeElement.tagName).toUpperCase() == "BODY") return;
                            let _pushcbfname = cbfunction.substr(0, idx);
                            if (_pushcbfname != pushcbfname) return;
                            dispatchEvent(new Event("__crosswebex_extension_setcallback__"));
                        }
                    });
                    (document.body || document.documentElement).appendChild(transporter);

                    window.addEventListener('__crosswebex_extension_setcallback__', function(event){
                        var result = JSON.parse(document.getElementById("setcallback").getAttribute('result'));
                        var pcbfname = pushcbfname;
                        var pcbframeidx = pcbfname.lastIndexOf(".");
                        if(pcbframeidx > 0){
                            pcbfname = pcbfname.substring(pcbframeidx+1, pcbfname.length);
                        }
                        window[pcbfname](JSON.stringify(result.reply));
                    });
                } else {
                    console.log("[contentscript] invalid parameter");
                    return;
                }
            } else {
                tag_id = transporter.getAttribute("tag");
            }

            try {
                for (i = 0; i < message.exfunc.args.length; i++) {
                    message.exfunc.args[i].callback = message.exfunc.args[i].callback + "_setcallback_" + tag_id;
                }
                let event = document.createEvent("Events");
                event.initEvent(EVENT_FROM_PAGE, true, false);
                transporter.setAttribute("data", JSON.stringify(message));
                transporter.dispatchEvent(event);
            } catch (e) {
                console.log("[contentscript] error", e);
            }
        } else {
            let tag_id = "_crosswebex_dummy_id_" + new Date().getTime();
            let transporter = document.createElement("dummy");

            if (!message.id || typeof message.id != "string") transporter.id = tag_id;
            else transporter.id = message.id;

            transporter.addEventListener(EVENT_REPLY, function (event) {
                let result = this.getAttribute("result");
                if (this.parentNode) this.parentNode.removeChild(this);
                if (typeof callback == "function") {
                    result = JSON.parse(result);
                    callback(result);
                }
            });

            let event = document.createEvent("Events");
            event.initEvent(EVENT_FROM_PAGE, true, false);
            transporter.setAttribute("data", JSON.stringify(message));
            (document.body || document.documentElement).appendChild(transporter);
            transporter.dispatchEvent(event);
        }
    } catch (e) {
        console.log("[contentscript] error", e);
    }
}