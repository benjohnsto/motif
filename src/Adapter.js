export default class Adapter {

  constructor(main, endpoint) {
    this.main = main;
    this.endpoint = endpoint;
  }


  async get(canvas) {
    console.log('getting annotations');
        
    return fetch(`${this.endpoint}?canvas=${canvas}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    }).then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
	     return data;
    })
    .catch(() => this.all()); 
  
/*  
    return (await fetch(`${this.endpoint}?canvas=${canvas}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })).json();
    
*/     
  }
 
  

  async create(annotation) {
    console.log('creating annotation');
    return fetch(this.endpoint, {
      body: JSON.stringify(annotation),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    .catch(() => this.all());
  }
  
  
  
  all() {
  
  }
  


  async update(annotation) {
      console.log('Updating annotation...');
      var headers = {
           'Content-Type': 'application/json'
      }
      
      if(this.main.config.nonce) {
        headers['X-WP-Nonce'] = this.main.config.nonce
      }

      fetch(this.endpoint, { 
        method: 'PUT', 
        headers: headers,
        body: JSON.stringify(annotation) 
      }).then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      }).then(data => {
	     //this.main.sidebar.drawAnnotations(data);
	     console.log('finished updating');
      }).catch(error => console.error('Error:', error));   
  }
  
  
  
  


  async remove(annoid) {
    var id = annoid.replace(`${this.endpoint}/`,"");

    fetch(`${this.endpoint}/${id}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
          this.main.viewer.annotationPage = data;
          this.main.viewer.osd.clearOverlays();
          this.main.viewer.drawOverlays();
          this.main.sidebar.close();
    }).catch(error => console.error('Error:', error));      
   
  }

}
