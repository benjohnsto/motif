class WordpressAdapter {

  constructor(annotationPageId, endpoint) {
    this.annotationPageId = annotationPageId;
    this.endpoint = endpoint;
  }


  async get() {
    const annotationPage = await this.all();
    if (annotationPage) {
      return annotationPage;
    }
    return null;
  }
 
  

  async create(annotation) {
    console.log('create annotation');
    return fetch(this.endpoint, {
      body: JSON.stringify(annotation),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }).catch(() => this.all());
  }
  
  async update(annotation) {
    const annotationPage = await this.all();
    if (annotationPage) {
      const currentIndex = annotationPage.items.findIndex((item) => item.id === annotation.id);
      annotationPage.items.splice(currentIndex, 1, annotation);
      return fetch(this.endpoint, {
        body: JSON.stringify(annotationPage),
          headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'PUT',
      }).catch(() => this.all());

    }
    return null;
    
    
    
    
    
    
  }
  


  async remove(annoId) {
    const annotationPage = await this.all();
    if (annotationPage) {
      annotationPage.items = annotationPage.items.filter((item) => item.id !== annoId);
    }
    localStorage.setItem(this.annotationPageId, JSON.stringify(annotationPage));
    return annotationPage;
  }
  
  /** */
  async all() {
    
    return fetch(`${this.endpoint}?canvas=${this.annotationPageId}`, {
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
  }

}
