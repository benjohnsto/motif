
import * as manifesto from "manifesto.js";

import Viewer from './Viewer';
import Strip from './Strip';
import Sidebar from './Sidebar';
//import Adapter from './Adapter';

// Don't forget to import the required CSS for the annotation layer UI
import '@annotorious/openseadragon/annotorious-openseadragon.css';
import mycss from './assets/css/style.css';
import close from './assets/images/close.svg';


class WPAnnotator {

    constructor(config) {
        this.config = config;
        this.divId = config.id;
        this.wrapper = document.getElementById(config.id);
        this.initUI();

        if (!this.config.id) { return false; }
        if (!this.config.manifest) { return false; }
        if(config.mode && config.mode == "edit") { this.mode = "edit"; }
        else { this.mode = "view"; }
                console.log(this.mode);

        this.manifest = config.manifest;
        this.manifestData = {};
        this.items = {};
        this.annotationPage = {};
        
        this.viewer = new Viewer(this);
        this.strip = new Strip(this);
        this.sidebar = new Sidebar(this);

        if(config.annotation.endpoint) {
          this.loadAdapter();
          //this.adapter = new Adapter( this, config.annotation.endpoint );
        }
        if(config.annotation.creator) {
          this.viewer.annotationTemplate.creator = config.annotation.creator;
        }
        if(config.annotation.institution) {
          this.viewer.annotationTemplate.institution = config.annotation.institution;
        }
        if(config.annotation.course) {
          this.viewer.annotationTemplate.course = config.annotation.course;
        }

          this.load(config.manifest)
            .then(() => {
                this.strip.draw(); 
                this.viewer.open(this.manifestData.items[0]);
                
                //setItem(this.manifestData.items[0]);
                //this.viewer.currentItem = this.manifestData.items[0];
            })
            .catch(err => {
                console.log("Something failed along the way", err);
            });          


    }
    
    async loadAdapter() {
      //console.log(this.config.annotation.adapter);
      
      var path = `${this.config.annotation.adapter}`;
      this.adapterModule = await import('./LocalStorageAdapter');
      this.adapter = new this.adapterModule.default("",this.config.annotation.endpoint); 
    }

    initUI() {

        const t = document.createElement("div");
        t.id = `${this.divId}_top`;
        t.setAttribute('class','myframe');
        t.style.height = (document.getElementById(this.divId).offsetHeight - 120) + "px";
        t.style.display = "flex";
        t.style.overflow = "hidden";
        t.style.position = "relative";
        this.wrapper.appendChild(t);
               
        
        const b = document.createElement("div");
        b.id = `${this.divId}_bottom`;
        b.style.height = "120px";
        b.style["overflow-y"] = "auto";
        b.style["margin"] = "10px 0";
        this.wrapper.appendChild(b); 

        const tv = document.createElement("div");
        tv.id = `${this.divId}_viewer`;
        tv.classList.add('viewer');       
        t.appendChild(tv);

        const tp = document.createElement("div");
        tp.id = `${this.divId}_panel`;
        tp.classList.add('panel');
        tp.style['overflow-x'] = "auto";
        t.appendChild(tp);  
        
	// panel toolbar
        const tt = document.createElement("div");
        tt.id = `${this.divId}_panel_toolbar`;
        tt.style['position'] = "absolute";
        tt.style.right = "0px";
        const close_tp = document.createElement("img");
        close_tp.src = close;
        close_tp.style.padding = "8px";
        close_tp.onclick = (event) => {
           this.sidebar.close();
           this.viewer.deactivateCrop();
           this.viewer.selectionMode = true;
           this.viewer.osd.removeOverlay("overlay");
           this.viewer.overlayOn = false;
           this.sidebar.clearForm();
           this.sidebar.close();
        }
        tt.appendChild(close_tp);
        tp.appendChild(tt);
        
        
	// panel form        
        const tf = document.createElement("div");
        tf.id = `annoForm`;
        tf.innerHTML = `
             <div id="previewImg"><img id='preview' src=''/></div>
             <input type='hidden' id='annoId' value='' placeholder='id'/>
             <input type='hidden' id='canvasUri' value=''/>
             <textarea name='text' id='annoText' rows='8'></textarea>
             <input type='text' name='tags' id='annoTags' placeholder='Tags'/>
             <input type='button' id='annoSubmit' class='button' value='Create'/>
             `;
        tp.appendChild(tf);
        
        const tal = document.createElement("div");
        tal.id = `annoList`;     
        tp.appendChild(tal);
        
        document.getElementById("annoSubmit").addEventListener("click", (e) => this.sidebar.saveAnnotation(e));

    }
    


    async load(url) {
    
    
    // Return the promise chain so the caller can await it
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(async data => { // Added async here to handle inner awaits
            const manifestobj = manifesto.parseManifest(data);
            
            if (manifestobj.isCollection()) {
                this.type = 'collection';
                this.mode = 'collection';
                this.collection = {
                    'id': manifestobj.id,
                    'label': manifestobj.getLabel().getValue()
                };

                // Map each item to a recursive load promise
                const promises = manifestobj.items.map(item => this.load(item.id));
                
                // CRITICAL: Wait for all nested fetches to finish completely
                await Promise.all(promises);
                
            } else {
                var canvases = manifestobj.getSequences()[0].getCanvases();

                var obj = {
                    'id': manifestobj.id,
                    'label': manifestobj.getDefaultLabel(),
                    'thumb': canvases[0].getCanonicalImageUri(200),
                    'meta': manifestobj.getMetadata(),
                    'items': []
                };

                for (var i in canvases) {
                    var o = {
                        'service': canvases[i].imageResources[0].getServices()[0].id,
                        'thumb': canvases[i].getCanonicalImageUri(100),
                        'canvas': canvases[i].id,
                        'rotation': 0
                    };
                    obj.items.push(o);
                    this.items[canvases[i].id] = o;
                }
                
                obj.thumb = obj.items[0].thumb;
                this.manifestData = obj;
            }
        })
        .catch(error => {
            console.error(`Failed to load or parse manifest from ${url}:`, error);
            throw error; // Re-throw so the caller knows it failed
        });
      }
     }


window.WPAnnotator = WPAnnotator;
