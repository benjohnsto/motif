class NanostoreAdapter {

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
    return fetch(`${this.endpoint}/create`, {
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
      return fetch(`${this.endpoint}/update`, {
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
    console.log('delete annotation');
    return fetch(`${this.endpoint}/delete`, {
      body: JSON.stringify(annotation),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify("id",annoId)
    }).catch(() => this.all());
  }
  
  
  
  /** */
  async all() {
    
    return fetch(`${this.endpoint}/query`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ "type": "Annotation","target.source": this.annotationPageId })
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
