export default class Strip {

    constructor(main) {
        this.main = main;      
        this.init();
    }

    init() {
        const sbc = document.createElement("div");
        sbc.id = `${this.main.divId}_bottom_content`;
        sbc.style.display = "flex";
        sbc.style.width = "fit-content";

        document.getElementById(`${this.main.divId}_bottom`).appendChild(sbc);
        
    }
    
    draw() {
      console.log('drawing strip');
      for(var i in this.main.manifestData.items) {
        this.addTile(i, this.main.manifestData.items[i]);
      }
    }
    
    highlight(id) {
        document.querySelectorAll('.tile').forEach(function(element, index) {
           element.classList.remove('active');
        });
        document.getElementById(id).classList.add('active');
    }
    


    addTile(index, o) {

      const tile = document.createElement('a');
     
      tile.setAttribute('rel', index);
      tile.id = o.canvas;
      tile.setAttribute('href', '#');
      tile.setAttribute('class', 'tile');
      tile.innerHTML = `<img src='${o.thumb}'/>`;
           
      tile.onclick = (event) => { 
        event.preventDefault();
        this.highlight(event.currentTarget.id);
        
        var rel = parseInt(event.currentTarget.getAttribute('rel'));
        var service = event.currentTarget.getAttribute('data-service');
        this.main.viewer.currentItem = this.main.manifestData.items[rel];
        this.main.canvas = this.main.manifestData.items[rel].canvas;
        this.main.viewer.open(this.main.manifestData.items[rel]);

      };	
      document.getElementById(`${this.main.divId}_bottom_content`).appendChild(tile); 
    }  

}
