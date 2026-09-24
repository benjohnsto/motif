

export default class Sidebar {

    constructor(main) {
        this.main = main;
        this.mode = 'collection';
        this.annotations = [];     
        this.init();
    }

    init() {


    }
    

    create() {
         var region = this.main.viewer.annotation.target.selector.value.replace('xywh=','').split(',');
         var rotation = this.main.viewer.currentItem.rotation;
         var image = `${this.main.viewer.currentItem.service}/${region}/,300/${rotation}/default.jpg`;
         document.getElementById('canvasUri').value = this.main.viewer.currentItem.canvas;
         document.getElementById('annoText').value = this.main.viewer.annotation.body[0].value;
         document.getElementById('preview').setAttribute('src',image);
         document.getElementById(`annoForm`).style.display = "flex";
         document.getElementById(`annoList`).style.display = "none";
         document.getElementById("annoSubmit").innerText = "Create";
         this.open();       
    }
    
    
    
    
    editAnnotation(anno) {

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
         document.getElementById('preview').setAttribute('src',image);
         document.getElementById(`annoForm`).style.display = "flex";
         document.getElementById(`annoList`).style.display = "none";
         document.getElementById("annoSubmit").innerText = "Update";
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
    }
    
    
    close() {
         var v = document.getElementById(`${this.main.divId}_viewer`);
         v.classList.remove('split');
         var p = document.getElementById(`${this.main.divId}_panel`);
         p.classList.remove('split');
    }
    
    clearForm() {
      document.getElementById("preview").setAttribute('src','');
      document.getElementById("canvasUri").value = "";
      document.getElementById("annoText").value = "";
      document.getElementById("annoTags").value = "";
    }
    
    
    
    
    showAnnotation(id) {
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



    drawAnnotation(anno) {

        var region = anno.target.selector.value.replace('xywh=pixel:','').replace('xywh=','').split(',').map((x)=>{return parseInt(x)});
	//this.main.viewer.drawOverlay(anno.id, region);

	const newanno = document.createElement("div");
	newanno.classList.add('annotation');
	newanno.setAttribute('id',`an_${anno.id}`);
	newanno.setAttribute('rel',`hi_${anno.id}`);

	
	var service = this.main.items[anno.target.source].service;
	//var region = anno.target.selector.value.replace('xywh=pixel:','').replace('xywh=','').split(',').map((x)=>{return parseInt(x)}).join(',');

	const imgcontainer = document.createElement("div");
	imgcontainer.classList.add('imageFrame');		
	newanno.appendChild(imgcontainer);
	const image = document.createElement("img");
	image.classList.add('image');
	
	//if(anno.body[1]) { var rotation = anno.body[1].value.split('/')[11]; } else { var rotation = 0; }
	
	
	
	//image.setAttribute('src',`${service}/${region}/300,/${rotation}/default.jpg`)
	image.setAttribute("src",anno.body[1].value);	
	imgcontainer.appendChild(image);
		
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
	
	// populate content
	//if(anno.body.length > 0) { content.innerHTML = anno.body[0].value; }
	
	// populate content
	//if(anno.body.length > 1) { content.innerHTML = anno.body[0].value; }		
	
	if(this.main.mode == 'edit') {
		const tools = document.createElement("div");
		tools.classList.add('annotools');		
		newanno.appendChild(tools);
		
		// populate tools
					
		const editlink = this.main.domElement("a", null, {"href":"#","class":"annoedit","data-id":anno.id}, tools);
                const editicon = this.main.domElement("img", null, {"src": `${this.main.iconpath}/edit.svg`}, editlink);
		const deletelink = this.main.domElement("a", null, {"href":"#","data-id":anno.id}, tools);
                const deleteicon = this.main.domElement("img", null, {"src": `${this.main.iconpath}/remove.svg`}, deletelink);
		
		editlink.addEventListener('click', (e) => {
		  var id = e.currentTarget.getAttribute('data-id');
		  
		  var items = this.main.viewer.annotationPage.items;
		  
		  for(var i in items) {
		    if(items[i].id == id) {
		      var anno = items[i];
		      this.editAnnotation(anno);
		    }
		  }
		});

		deletelink.addEventListener('click', (e) => {
		  var id = e.currentTarget.getAttribute('data-id');
		  this.deleteAnnotation(id);
		});

	} // end if mode = edit

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
          var thumbnail =  document.getElementById('preview').getAttribute('src'); 
              
          var text = this.htmlConvert(document.getElementById('annoText').value);
          
          // remove any body elements of type tag
          this.main.viewer.annotation.body = this.main.viewer.annotation.body.filter(item => item.type !== 'Tag');
          // convert comma seperated list off tags to an array
          var tags = this.tagConvert(document.getElementById('annoTags').value);
          
          this.main.viewer.annotation.target.source = document.getElementById('canvasUri').value;
          this.main.viewer.annotation.body[0].value = text;
          this.main.viewer.annotation.body[1].value = thumbnail;
          
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
