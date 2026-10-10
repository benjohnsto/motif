class NanostoreAdapter {




  constructor(annotationPageId, endpoint) {
    this.annotationPageId = annotationPageId;
    this.endpoint = endpoint;
  }


  async get() {
    const annotations = await this.all();
    if (annotations) {
      console.log(annotations);
      return {
	   id: this.annotationPageId,
	   type: 'AnnotationPage',
	   items: annotations
	   };

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
    console.log('update annotation');
    return fetch(`${this.endpoint}/update`, {
      body: JSON.stringify(annotation),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    }).catch(() => this.all());
  }
  


  async remove(annoId) {
    annoId = annoId.split('/');
    annoId = annoId[annoId.length-1];
    return fetch(`${this.endpoint}/delete`, {
      body: JSON.stringify({"@id": annoId}),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'DELETE'
    }).then((data)=>{
      return this.get();
      
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

