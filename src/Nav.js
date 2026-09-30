
import close from './assets/icons/close.svg';

export default class Nav {

    constructor(main) {
        this.main = main;
        this.manifests = [];
        this.current = "";
        this.ui = {};     
        this.init();
    }


    init() {
      this.ui.panel = this.main.domElement("div", "navpanel", {"class":"whatever"}, this.main.wrapper);
      var head = this.main.domElement("div", "navpanelhead", {"class":"navpanel-head"}, this.ui.panel);
      
      // form
      var f = this.main.domElement("form", "addmanifest", {"name":"addmanifest"}, head);
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        this.addManifest();
      });
      this.ui.manifest = this.main.domElement("input", null, {"type":"text"}, f);
      var i = this.main.domElement("input", null, {"type":"submit","value":"Go"}, f);
      
      var a = this.main.domElement("a", null, {"href":"#"}, head);
      var i = this.main.domElement("img", null, {"src": close,"onclick":"close"}, a);
      i.addEventListener("click", (e) => { this.close(); });


      
      this.ui.panelcontent = this.main.domElement("div", "navpanelcontent", {"class":"navpanel-content"}, this.ui.panel);
      var gc = this.main.domElement("div", "gallerycontainer", {}, this.ui.panelcontent);
      this.ui.gallery = this.main.domElement("div", "gallery", {}, gc);
    }
    
    

    open() {
         this.ui.panel.classList.add('shown'); 
    }
    
    
    close() {
         this.ui.panel.classList.remove('shown');
    }
    
    addManifest() {
      this.main.parse(this.ui.manifest.value)
        .then(() => {
                console.log(this.main.manifests);
                this.draw()
        })
        .catch(err => {
                console.log("Something failed along the way", err);
        }); 
    }
    
    draw() {
         this.ui.gallery.innerHTML = "";
         for(var i in this.main.manifests) {
            var a = this.main.domElement("a", null, {"class":"tile", "href":"#","title":this.main.manifests[i].label,"data-id":this.main.manifests[i].id}, this.ui.gallery);
            
            this.main.domElement("img", null, {"src":this.main.manifests[i].thumb}, a);
            a.addEventListener("click", (event) => { 
              var manifest = event.currentTarget.getAttribute('data-id');
              this.main.manifest = manifest;
              this.main.manifestData = this.main.manifests[manifest];
              this.main.load();
              this.main.sidebar.setMode('view');
              this.close();
            });

         }
    }
    

    


}
