export default class Strip {

    constructor(main) {
        this.main = main;
        this.init();
    }

    init() {
        this.wrap = document.getElementById(`${this.main.divId}_bottom`);
        this.element = document.createElement("div");
        this.element.id = `${this.main.divId}_bottom_content`;
        this.element.style.display = "flex";
        this.element.style.width = "fit-content";

        this.wrap.appendChild(this.element);
        
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
    
    scrollTo(targetElement) {
      if (!targetElement || !this.wrap) return;

      const wrapWidth = this.wrap.clientWidth;
      const tileLeft = targetElement.offsetLeft;
      const tileWidth = targetElement.offsetWidth;

      // Calculate horizontal position to align tile center with container center
      const scrollPosition = tileLeft - (wrapWidth / 2) + (tileWidth / 2);

      this.wrap.scrollTo({
        left: scrollPosition,
        top: 0,
        behavior: 'smooth'
      });
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
        this.scrollTo(event.currentTarget);
        
        var rel = parseInt(event.currentTarget.getAttribute('rel'));
        var service = event.currentTarget.getAttribute('data-service');
        this.main.viewer.currentItem = this.main.manifestData.items[rel];
        this.main.canvas = this.main.manifestData.items[rel].canvas;
        this.main.viewer.open(this.main.manifestData.items[rel]);

      };	
      document.getElementById(`${this.main.divId}_bottom_content`).appendChild(tile); 
    }  

}
