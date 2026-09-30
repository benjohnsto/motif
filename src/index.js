
import * as manifesto from "manifesto.js";

import Viewer from './Viewer';
import Strip from './Strip';
import Sidebar from './Sidebar';
import Nav from './Nav';

import close from './assets/icons/close.svg';

import '@annotorious/openseadragon/annotorious-openseadragon.css';
import mycss from './assets/css/style.css';

class Motif {

    constructor(config) {
        this.config = config;
        this.divId = config.id;

        this.ui = {};
        this.wrapper = document.getElementById(config.id);
        this.mode = config.mode === "edit" ? "edit" : "view";
        this.initUI();

        if (!this.config.id) { return false; }
        if (!this.config.manifest) { return false; }

        this.manifest = config.manifest;
        this.manifests = {};
        this.manifestData = {};
        this.items = {};
        this.annotationPage = {};
        
        if(config.showNav) { this.showNav = true; }
        if(config.annotation.adapter) { this.adapter = config.annotation.adapter; }
        
        this.viewer = new Viewer(this);
        this.strip = new Strip(this);
        this.sidebar = new Sidebar(this);
        
        this.nav = new Nav(this);

          this.parse(config.manifest)
            .then(() => {
                this.manifest = Object.values(this.manifests)[0].id;
                this.manifestData = Object.values(this.manifests)[0];
                this.load();
            })
            .catch(err => {
                console.log("Something failed along the way", err);
            });          


    }

    initUI() {
        this.wrapper.style.position = "relative";
        //this.wrapper.style.overflow = "hidden";
        this.ui.top = document.createElement("div");
        this.ui.top.id = `${this.divId}_top`;
        this.ui.top.setAttribute('class','myframe');
        this.ui.top.style.height = (document.getElementById(this.divId).offsetHeight - 120) + "px";
        this.ui.top.style.display = "flex";
        this.ui.top.style.overflow = "hidden";
        this.ui.top.style.position = "relative";
        this.wrapper.appendChild(this.ui.top);
               
        
        this.ui.bottom = document.createElement("div");
        this.ui.bottom.id = `${this.divId}_bottom`;
        this.ui.bottom.style.height = "120px";
        this.ui.bottom.style["overflow-y"] = "auto";
        this.ui.bottom.style["margin"] = "10px 0";
        this.wrapper.appendChild(this.ui.bottom); 

        const tv = document.createElement("div");
        tv.id = `${this.divId}_viewer`;
        tv.classList.add('viewer');       
        this.ui.top.appendChild(tv);

        const tp = document.createElement("div");
        tp.id = `${this.divId}_panel`;
        tp.classList.add('panel');
        tp.style['overflow-x'] = "auto";
        this.ui.top.appendChild(tp);  
        
	// panel toolbar
        const tt = document.createElement("div");
        tt.id = `${this.divId}_panel_toolbar`;
        tt.style['text-align'] = "right";
        tt.style.padding = "8px";

	const close_tp = document.createElement("a");
	close_tp.setAttribute("href", "#");
	close_tp.setAttribute("aria-label", "Close"); // Essential for accessibility!

	const close_tp_img = document.createElement("img");
	close_tp_img.src = typeof close === 'object' && close.default ? close.default : close;
	close_tp_img.alt = "Close icon";

	close_tp.appendChild(close_tp_img);



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
             <input type='hidden' id='annoId' value='' placeholder='id'/>
             <input type='hidden' id='canvasUri' value=''/>
             <textarea name='text' id='annoText' rows='8'></textarea>
             <input type='text' name='tags' id='annoTags' placeholder='Tags'/>
             <!--<input type='button' id='annoSubmit' class='button' value='Create'/>-->
             `;
        tp.appendChild(tf);
        
        const tal = document.createElement("div");
        tal.id = `annoList`;     
        tp.appendChild(tal);
        const tools = document.createElement("div");
        tools.id = `annoTools`;
        tp.appendChild(tools);


    }
    


async parse(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/ld+json, application/json'
      }
    });

    if (!response.ok) {
      console.warn(`Skipping \({url}: HTTP\){response.status}`);
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    
    // Cloudflare returns text/html instead of JSON
    if (contentType.includes('text/html')) {
      const text = await response.text();
      if (text.includes('Enable JavaScript and cookies') || text.includes('cf-browser-verification')) {
        console.warn(`Skipping ${url}: Intercepted by Cloudflare bot protection.`);
        return null;
      }
      
      console.warn(`Skipping ${url}: Expected JSON but received HTML.`);
      return null;
    }

    const data = await response.json();
    const manifestobj = manifesto.parseManifest(data);

    if (manifestobj.isCollection()) {
      this.type = 'collection';
      this.showNav = true;
      console.log(this);
      this.collection = {
        'id': manifestobj.id,
        'label': manifestobj.getLabel() ? manifestobj.getLabel().getValue() : 'Untitled Collection'
      };

      // Map each item to a recursive load promise
      const promises = manifestobj.items.map(item => this.parse(item.id));
      
      // Filter out skipped/failed null results
      const results = await Promise.all(promises);
      return results.filter(Boolean);

    } else {
      const sequences = manifestobj.getSequences();
      if (!sequences || !sequences.length) {
        console.warn(`Skipping ${url}: No sequences found in manifest.`);
        return null;
      }

      const canvases = sequences[0].getCanvases();
      const obj = {
        'id': manifestobj.id,
        'label': manifestobj.getDefaultLabel(),
        'thumb': canvases[0] ? canvases[0].getCanonicalImageUri(200) : '',
        'meta': manifestobj.getMetadata(),
        'items': []
      };

      for (const canvas of canvases) {
        const imageResource = canvas.imageResources?.[0];
        const service = imageResource?.getServices()?.[0];

        const o = {
          'service': service ? service.id : '',
          'thumb': canvas.getCanonicalImageUri(100),
          'canvas': canvas.id,
          'rotation': 0
        };
        obj.items.push(o);
        this.items[canvas.id] = o;
      }

      if (obj.items.length > 0) {
        obj.thumb = obj.items[0].thumb;
      }

      this.manifestData = obj;
      this.manifests[url] = obj;
      return obj;
    }

  } catch (error) {
    console.error(`Failed to parse manifest from ${url}:`, error);
    // Returning null allows Promise.all in parent collections to complete for other valid items
    return null; 
  }
}
      
      
      load() {
        console.log(this.manifest);
        console.log(this.manifestData);
        this.strip.draw();
        this.nav.draw();
        this.viewer.open(this.manifestData.items[0]);
      }
      
      
      domElement(element, id, attr, appendTo = null, innerHTML = null) {
         var r = document.createElement(element);
         if(id !== null) { r.id = id; }
         for(var i in attr) {
            if(i == "class") { 
              if(Array.isArray(attr[i])) { 
                var cls = attr[i].map((c)=>{r.classList.add(c);});
              }
              else { r.classList.add(attr[i]); }
            }
            else { r.setAttribute(i, attr[i]); }
         }
         if(innerHTML) { r.innerHTML = innerHTML; }
         if(appendTo) { appendTo.appendChild(r); }
         return r;
      }
      
      
      
     }


window.Motif = Motif;
