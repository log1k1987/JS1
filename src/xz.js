function deleteTextNodes(where) {
  for (var el of where.childNodes) {
    if(el.nodeType === 3) {
      console.log('нашел');
    }
  }
  for (var el of where.childNodes) {
    if(el.nodeType === 3) {
      where.removeChild(el);
    }
  }
  for (var el of where.childNodes) {
    if(el.nodeType === 3) {
      console.log('нашел');
    }
  }
}

deleteTextNodes(document.body);
//console.log(xz);
//document.body.removeChild(document.getElementsByTagName('div')[0])