import OpenSeadragon from 'openseadragon';


export default class Viewer {

    constructor( main ) {
        this.main = main;
        this.currentItem = {};
        this.overlayOn = false;
        this.mode = 'view';        
        this.annotationTemplate = {
	    "@context": "http://www.w3.org/ns/anno.jsonld",
	    "id": "",
	    "type": "Annotation",
	    "creator": "",
	    "created": "",
	    "institution": "",
	    "course": "",
	    "project": "",
	    "body": [
	      {
		"type": "TextualBody",
		"value": "",
		"purpose": "commenting"
	      },
	      {
                "type": "Image",
                "value": "",
                "format": "image/jpeg",
                "purpose": "thumbnail"
              }
	    ],
	    "target": {
	      "source": "",
	      "selector": {
		"type": "FragmentSelector",
		"conformsTo": "http://www.w3.org/TR/media-frags/",
		"value": "xywh=10,10,500,500"
	      },
	      "partOf": {
		"id": `${this.main.config.manifest}`,
		"type": "Manifest"
	      }
	    }}
	this.annotation = {};
	this.overlay = {};
        this.init();
    }

    init() {


        // Initialize OpenSeadragon

        this.osd = OpenSeadragon({
            id: `${this.main.divId}_viewer`,
            prefixUrl: "", // Set to empty to override default prefixUrl
            tileSources: [],
            navImages: {
                zoomIn: {
                  REST: `${this.main.iconpath}/zoomin.svg`,
                  GROUP: `${this.main.iconpath}/zoomin.svg`,
                  HOVER: `${this.main.iconpath}/zoomin.svg`,
                  DOWN: `${this.main.iconpath}/zoomin.svg`
                },
                zoomOut: {
                  REST: `${this.main.iconpath}/zoomout.svg`,
                  GROUP: `${this.main.iconpath}/zoomout.svg`,
                  HOVER: `${this.main.iconpath}/zoomout.svg`,
                  DOWN: `${this.main.iconpath}/zoomout.svg` 
                },
                home: {
                  REST: `${this.main.iconpath}/home.svg`,
                  GROUP: `${this.main.iconpath}/home.svg`,
                  HOVER: `${this.main.iconpath}/home.svg`,
                  DOWN: `${this.main.iconpath}/home.svg`
                },
                fullpage: {
                  REST: `${this.main.iconpath}/full.svg`,
                  GROUP: `${this.main.iconpath}/full.svg`,
                  HOVER: `${this.main.iconpath}/full.svg`,
                  DOWN: `${this.main.iconpath}/full.svg`
                }
            }
        });
        
      this.osd.addHandler('rotate', () => {
        this.currentItem.rotation = this.osd.viewport.getRotation();

        if (this.currentItem.rotation < 0) {
            this.currentItem.rotation = 360 + this.currentItem.rotation;
        }
        if (this.currentItem.rotation == 360) {
            this.currentItem.rotation = 0;
        }
      });


      this.osd.tracker = new OpenSeadragon.MouseTracker({
            element: this.osd.element,
            pressHandler: (event) => {  this.handlePress(event);  },
            dragHandler: (event) => {  this.handleDrag(event);  },
            releaseHandler: (event) => {  this.handleRelease(event);  }
      });
  
      
           


        this.rotateLeftButton = new OpenSeadragon.Button({
            tooltip: '',
            srcRest: `${this.main.iconpath}/rotateleft.svg`,
            srcHover: `${this.main.iconpath}/rotateleft.svg`,
            onClick: () => this.rotateLeft()
        });
        
        this.osd.addControl(this.rotateLeftButton.element, {
            anchor: OpenSeadragon.ControlAnchor.TOP_LEFT
        });

        this.rotateRightButton = new OpenSeadragon.Button({
            tooltip: '',
            srcRest: `${this.main.iconpath}/rotateright.svg`,
            srcHover: `${this.main.iconpath}/rotateright.svg`,
            onClick: () => this.rotateRight()
        });
        this.osd.addControl(this.rotateRightButton.element, {
            anchor: OpenSeadragon.ControlAnchor.TOP_LEFT
        });

        // if we are in edit mode, add the crop button
        if(this.main.mode == 'edit') {
            
            let cropButton = new OpenSeadragon.Button({
                tooltip: '',
                srcRest: `${this.main.iconpath}/crop.svg`,
                srcHover: `${this.main.iconpath}/crop.svg`,
                onClick: () => this.toggleCrop()
            });
            cropButton.element.id = 'cropbutton';
            this.osd.addControl(cropButton.element, {
                anchor: OpenSeadragon.ControlAnchor.TOP_LEFT
            });
        }
        
        


    }
    
    
    
    open(item) {
      this.currentItem = item;
      this.main.viewer.setAnnotations(item.canvas);
      this.osd.open(item.service + "/info.json");
      this.main.sidebar.close();
      this.main.strip.highlight(item.canvas);
      this.deactivateCrop();
    }
    
    
    
    
    /*************************
    * activate / deactivate crop
    *************************/
    
    deactivateCrop() {
       if(this.main.mode == 'edit') {
        var cropbuttons = document.getElementById('cropbutton').getElementsByTagName('img');
        for (let i = 0; i < cropbuttons.length; i++) {
            cropbuttons[i].src = `${this.main.iconpath}/crop.svg`;
        }
        this.main.cropActive = false;
        this.mode = 'view';
        this.osd.setMouseNavEnabled(true);
        this.osd.removeOverlay(this.overlay);
        this.overlayOn = false;
        this.main.sidebar.clearForm();
        this.main.sidebar.close(); 
       }       
    }

    activateCrop() {
      if(this.main.mode == 'edit') {
        var cropbuttons = document.getElementById('cropbutton').getElementsByTagName('img');
        for (let i = 0; i < cropbuttons.length; i++) {
            cropbuttons[i].src = `${this.main.iconpath}/cropActive.svg`;
        }
        this.main.cropActive = true;
        this.mode = 'crop';
        this.main.sidebar.clearForm();
        this.osd.setMouseNavEnabled(false);
        this.annotation = structuredClone(this.annotationTemplate);
        this.annotation.id = this.makeid();
      }
    }

    toggleCrop() {
        if (this.main.cropActive) {
            this.deactivateCrop();
        } else {
            this.activateCrop();
            this.main.sidebar.close();
        }
    }
    
    /************************************
    *
    ************************************/
    makeid() {
	    let result = '';
	    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	    const charactersLength = characters.length;
	    let counter = 0;
	    while (counter < 24) {
	        result += characters.charAt(Math.floor(Math.random() * charactersLength));
	        counter += 1;
	    }
	    return result;
    }
    
    
       
    
    drawOverlay(anno) {
        var id = anno.id;
        var region = anno.target.selector.value.replace('xywh=pixel:','').replace('xywh=','').split(',').map((x)=>{return parseInt(x)});
        var overlayElement = document.createElement("div");
        overlayElement.setAttribute("href","#");
        overlayElement.addEventListener('mouseover', (e) => {  });
        overlayElement.addEventListener('mouseleave', (e) => {  });    
        
        overlayElement.className = "overlay";
        overlayElement.setAttribute('id',`${id}`);
        overlayElement.setAttribute('rel',`${id}`);
        
        const pixelRect = new OpenSeadragon.Rect(region[0],region[1],region[2],region[3]);
        const viewportRect = this.osd.viewport.imageToViewportRectangle(pixelRect);
        this.osd.addOverlay({
            element: overlayElement,
            location: viewportRect
        });

        /********************************
        * Click on bounding box
        ********************************/ 
	new OpenSeadragon.MouseTracker({
	   element: overlayElement,
           clickHandler: (event) => {
                // Prevent OSD from interpreting this as a canvas click/zoom
                event.preventDefaultAction = true;
                //overlayElement.style.borderColor = "#ff0000";
                overlayElement.classList.add('highlight');
                const rel = event.originalTarget.getAttribute('rel');
		this.main.sidebar.showAnnotation(rel);
	   }
	}); 
	

    }
    
    
    drawOverlays() {
       this.osd.clearOverlays();
       for(var i in this.annotationPage.items) {
         this.drawOverlay(this.annotationPage.items[i]);
       }
    }
    
    
    
    
    /***********************
    * 
    ***********************/
    async setAnnotations(canvas) {
  

      if(this.main.adapter.endpoint) {
        //this.osd.clearOverlays();
        
	try {

             if(this.main.adapter) {

              this.main.adapter.annotationPageId = this.main.viewer.currentItem.canvas;
              this.annotationPage = await this.main.adapter.get();
              console.log(this.annotationPage);

              if(this.annotationPage) {
                   const myTimeout = setTimeout(() => { 
                     this.drawOverlays();
                    }, 500);
              }

             }
  
	  } catch (error) {
	    // Handles network errors or the HTTP errors thrown from response.ok
	    console.error("Failed to fetch canvas:", error);
	  }      

      }
    
    }    


    /*************************
    * rotate
    *************************/

    rotateLeft() {
        var rotation = this.osd.viewport.getRotation() - 90;
        if(rotation < 0) { rotation = 270; }
        this.osd.viewport.setRotation(rotation);
        this.currentItem.rotation = rotation;
    }

    rotateRight() {
        var rotation = this.osd.viewport.getRotation() + 90;
        if(rotation >= 360) { rotation = 0; }
        this.osd.viewport.setRotation(rotation);
        this.currentItem.rotation = rotation;
    }
    
    
    
    /*************************
    * hand mouse actions on viewer canvas
    *************************/
    
    handlePress(event) {
        if (!this.mode == 'view') {  return;  }
	if (this.overlayOn) {  this.osd.removeOverlay("overlay");  }
        this.overlay = document.createElement("div");
        this.overlay.id = "overlay";
        this.overlay.className = "overlay";

        var viewportPos = this.osd.viewport.pointFromPixel(event.position);
        this.osd.addOverlay({
            element: this.overlay,
            location: new OpenSeadragon.Rect(viewportPos.x, viewportPos.y, 0, 0)
        });
        this.overlayOn = true;
            
        this.osd.drag = {
            overlayElement: this.overlay,
            startPos: viewportPos
        };
    }
    
    handleDrag(event) {
            if (typeof this.osd.drag === 'undefined') { return; }
            var viewportPos = this.osd.viewport.pointFromPixel(event.position);

            var diffX = viewportPos.x - this.osd.drag.startPos.x;
            var diffY = viewportPos.y - this.osd.drag.startPos.y;

            var location = new OpenSeadragon.Rect(
                Math.min(this.osd.drag.startPos.x, this.osd.drag.startPos.x + diffX),
                Math.min(this.osd.drag.startPos.y, this.osd.drag.startPos.y + diffY),
                Math.abs(diffX),
                Math.abs(diffY)
            );
           
            
            var tiledImage = this.osd.world.getItemAt(0);
            var tileSource = tiledImage.source;

            

            var w = tileSource.width;
            var h = tileSource.height;
            
            

            var region = [
                Math.floor(location.x * w),
                Math.floor(location.y * w),
                Math.floor(location.width * w),
                Math.floor(location.height * w)
            ]


            // if the box goes outside the boundaries of the image

                if (region[0] < 0) { region[0] = 0;  }
                if (region[1] < 0) { region[1] = 0;  }
                if (region[0]+region[2] > w) { region[2] = w - region[0]; }
                if (region[1]+region[3] > h) { region[3] = h - region[1]; }


            // update the box    
            this.osd.updateOverlay(this.osd.drag.overlayElement, location);
            this.annotation.target.selector.value = "xywh=" + region.join(',');
    }
    
    
    handleRelease(event) {

            this.annotation.creator = "Ben Johnston";
            this.annotation.created = new Date().toISOString();
            this.annotation.institution = "Princeton";
            this.annotation.course = "ART 200, Fall 2026";
            this.annotation.project = "Test 1";

            this.overlay.classList.add('highlight');
            
            this.main.sidebar.create();
            this.mode = 'view';
    }	    
    


}
