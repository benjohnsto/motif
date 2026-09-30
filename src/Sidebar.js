
import trash from './assets/icons/trash.svg';
import save from './assets/icons/save.svg';
import edit from './assets/icons/edit.svg';

export default class Sidebar {

    constructor(main) {
        this.main = main;
        this.mode = 'view';
        this.annotations = [];
        this.current = "";
        this.ui = {};     
        this.init();
    }

    init() {
    
        var tools = document.getElementById("annoTools");

        this.ui.trash = this.main.domElement("a", "annoremove", {"href":"#","class":"annoremove"}, tools);
        this.main.domElement("img", null, {"src": trash}, this.ui.trash);
        
        var span = this.main.domElement("span", null, {}, tools);

        this.ui.save = this.main.domElement("a", "annosave", {"href":"#"}, span);
        this.ui.save.style.display = "none";
        var si = this.main.domElement("img", null, {"src": save}, this.ui.save);
        this.ui.edit = this.main.domElement("a", "annoedit", {"href":"#","class":"annoedit"}, span);
        this.main.domElement("img", null, {"src": edit}, this.ui.edit);
        
        
	this.ui.save.addEventListener("click", (e) => {
	  this.saveAnnotation(e);
	  this.setMode('view');
	});
        
	this.ui.edit.addEventListener('click', (e) => {
	  //var id = e.currentTarget.getAttribute('data-id');
	  
	  var items = this.main.viewer.annotationPage.items;	  
	  for(var i in items) {
	    if(items[i].id == this.current) {
	      var anno = items[i];
	      this.editAnnotation(anno);
	    }
	  }
	});

	this.ui.trash.addEventListener('click', (e) => {
	  //var id = e.currentTarget.getAttribute('data-id');
	  this.deleteAnnotation(this.current);
	});

    }
    

    create() {
         this.setMode('edit');
         var region = this.main.viewer.annotation.target.selector.value.replace('xywh=','').split(',');
         var rotation = this.main.viewer.currentItem.rotation;
         var image = `${this.main.viewer.currentItem.service}/${region}/,300/${rotation}/default.jpg`;
         document.getElementById('canvasUri').value = this.main.viewer.currentItem.canvas;
         document.getElementById('annoText').value = this.main.viewer.annotation.body[0].value;
         //document.getElementById('preview').setAttribute('src',image);
         document.getElementById(`annoForm`).style.display = "flex";
         document.getElementById(`annoList`).style.display = "none";
         //document.getElementById("annoSubmit").innerText = "Create";
         this.open();
                
    }
    
    
    
    
    editAnnotation(anno) {
	 this.setMode('edit');
         this.main.viewer.annotation = anno;
         var text = anno.body[0].value.replaceAll("<br />","\n");
         var tags = [];
         for(var i in anno.body) { 
           if(anno.body[i].type == 'Tag') { tags.push(anno.body[i].value); }
         }
         var region = anno.target.selector.value.replace('xywh=','').split(',');
         var rotation = this.main.viewer.currentItem.rotation;
         var image = `${this.main.viewer.currentItem.service}/${region}/,300/${rotation}/default.jpg`;
         document.getElementById('annoId').value = anno.id;
         document.getElementById('canvasUri').value = anno.target.source;
         document.getElementById('annoText').value = text;
         document.getElementById('annoTags').value = tags.join(",");
         //document.getElementById('preview').setAttribute('src',image);
         document.getElementById(`annoForm`).style.display = "flex";
         document.getElementById(`annoList`).style.display = "none";
         //document.getElementById("annoSubmit").innerText = "Update";
         this.open();       
    }
    
    
    
    
    
    list() {
         document.getElementById(`annoForm`).style.display = "none";
         document.getElementById(`annoList`).style.display = "flex";
         this.open();
    }
    
    open() {
         var v = document.getElementById(`${this.main.divId}_viewer`);
         v.classList.add('split');
         var p = document.getElementById(`${this.main.divId}_panel`);
         p.classList.add('split');
         //document.getElementById("annoText").focus();  
    }
    
    
    close() {
         var v = document.getElementById(`${this.main.divId}_viewer`);
         v.classList.remove('split');
         var p = document.getElementById(`${this.main.divId}_panel`);
         p.classList.remove('split');
         document.querySelectorAll('.overlay').forEach(o => o.classList.remove('highlight'));
         this.setMode('view');
    }
    
    clearForm() {
      //document.getElementById("preview").setAttribute('src','');
      document.getElementById("canvasUri").value = "";
      document.getElementById("annoText").value = "";
      document.getElementById("annoTags").value = "";
    }
    
    
    
    
    showAnnotation(id) {
      this.current = id;
      document.getElementById(`annoList`).innerHTML = "";
      var items = this.main.viewer.annotationPage.items;
      for(var i in items) {

        if(id == items[i].id) {
           this.drawAnnotation(items[i]);
           this.list();
           this.open();
        }

      }
    }
    
    setMode(mode) {
      this.mode = mode;
      if(this.mode === 'edit') {
      this.ui.save.style['display'] = "inline-block";
      this.ui.edit.style['display'] = "none";
      }
      else {
      this.ui.save.style['display'] = "none";
      this.ui.edit.style['display'] = "inline-block";
      }
    }




    drawAnnotation(anno) {

        var region = anno.target.selector.value.replace('xywh=pixel:','').replace('xywh=','').split(',').map((x)=>{return parseInt(x)});
	//this.main.viewer.drawOverlay(anno.id, region);

	const newanno = document.createElement("div");
	newanno.classList.add('annotation');
	newanno.setAttribute('id',`an_${anno.id}`);
	newanno.setAttribute('rel',`hi_${anno.id}`);

	
	var service = this.main.items[anno.target.source].service;
	
	const content = document.createElement("div");
	content.classList.add('annocontent');		
	newanno.appendChild(content);
	
	for(var i in anno.body) {
	   if(anno.body[i].type == 'TextualBody') { content.innerHTML += anno.body[i].value; }
	}
	var tags = [];
	for(var i in anno.body) {
	   if(anno.body[i].type == 'Tag') { tags.push(anno.body[i].value); }
	}
	if(tags.length > 0) {
	   content.appendChild(this.tagConvert(tags));
	}

	// append to main list		
	document.getElementById(`annoList`).appendChild(newanno); 

    }
    
    

    
    htmlConvert(str) {
      str = str.replaceAll("\n","<br />");
      return str;
    }
    
    tagConvert(str) {
      if(Array.isArray(str)) {
        const c = document.createElement("div");
	c.classList.add('tags');
	for(var i in str) { 
          const ct = document.createElement("span");
	  ct.classList.add('tag');
	  ct.innerText = str[i];
	  c.appendChild(ct);
	}
	return c;
      }
      else {
        var arr = str.split(",").map((i)=>{return i.trim();});
        return arr;
      }
    }    

    async saveAnnotation() {
    
          var id = document.getElementById('annoId').value;
          //var thumbnail =  document.getElementById('preview').getAttribute('src'); 
              
          var text = this.htmlConvert(document.getElementById('annoText').value);
          
          // remove any body elements of type tag
          this.main.viewer.annotation.body = this.main.viewer.annotation.body.filter(item => item.type !== 'Tag');
          // convert comma seperated list off tags to an array
          var tags = this.tagConvert(document.getElementById('annoTags').value);
          
          this.main.viewer.annotation.target.source = document.getElementById('canvasUri').value;
          this.main.viewer.annotation.body[0].value = text;
          //this.main.viewer.annotation.body[1].value = thumbnail;
          
          for(var i in tags) {
              if(tags[i] != "") {
                var o = {"type":"Tag","value":tags[i],"purpose": "tagging"}
                this.main.viewer.annotation.body.push(o);
              }
          }


          if(id == "") {
             if(this.main.adapter) {
              this.main.adapter.annotationPageId = this.main.viewer.currentItem.canvas;
              await this.main.adapter.create(this.main.viewer.annotation);
             }
          }
          else {
             if(this.main.adapter) {
              this.main.adapter.annotationPageId = this.main.viewer.currentItem.canvas;
              await this.main.adapter.update(this.main.viewer.annotation);
             }
          }

	  this.main.sidebar.close();
	  this.main.viewer.setAnnotations(this.main.viewer.currentItem.canvas);
	  this.main.viewer.deactivateCrop();
	  this.main.viewer.selectionMode = true;      
    }
    
    
    async deleteAnnotation(id) {
        if(confirm('Are you sure?')) {
           this.main.viewer.annotationPage = await this.main.adapter.remove(id);
          // this.main.viewer.osd.clearOverlays();
           this.main.viewer.drawOverlays();
           this.close();
        }
    }
    

}
