export default class Adapter {

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
    const emptyAnnoPage = {
      id: this.annotationPageId,
      items: [],
      type: 'AnnotationPage',
    };
    const annotationPage = await this.all() || emptyAnnoPage;
    
    annotationPage.items.push(annotation);
    localStorage.setItem(this.annotationPageId, JSON.stringify(annotationPage));
    console.log('CREATE ANNOTATION', annotationPage);
    return annotationPage;
  }
  
  async update(annotation) {

    const annotationPage = await this.all();
    if (annotationPage) {
      const currentIndex = annotationPage.items.findIndex((item) => item.id === annotation.id);
      annotationPage.items.splice(currentIndex, 1, annotation);
      localStorage.setItem(this.annotationPageId, JSON.stringify(annotationPage));
      console.log('UPDATE ANNOTATION', annotationPage);
      return annotationPage;
    }
    return null;
    
    
    
  /*
      console.log('Updating annotation...');
      var headers = {
           'Content-Type': 'application/json'
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
	     console.log('finished updating');
      }).catch(error => console.error('Error:', error)); 
    */  
  }
  
  
  
  


  async remove(annoId) {
    const annotationPage = await this.all();
    if (annotationPage) {
      console.log(annotationPage.items);
      annotationPage.items = annotationPage.items.filter((item) => item.id !== annoId);
      console.log(annotationPage.items);
    }
    localStorage.setItem(this.annotationPageId, JSON.stringify(annotationPage));
    return annotationPage;
  }
  
  /** */
  async all() {
    return JSON.parse(localStorage.getItem(this.annotationPageId));
  }

}
