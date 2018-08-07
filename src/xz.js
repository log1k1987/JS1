function collectDOMStat(root) {
    const stats = {
        tags: {},
        classes: {},
        texts: 0
    }

    function recc(elem) {
        for (let el of elem.childNodes) {
            if (el.nodeType === 1) {
                stats.tags[el.tagName] = stats.tags[el.tagName] ? ++stats.tags[el.tagName] : 1;

                for (let i = 0; i < el.classList.length; i++) { 
                    stats.classes[el.classList[i]] = stats.classes[el.classList[i]] ? ++stats.classes[el.classList[i]] : 1;
                }
                if (el.childNodes.length >= 0) {
                    recc(el);
                }
       
            } else if (el.nodeType === 3) {
                ++stats.texts;
            }
        }

    }
    recc(root);

    return stats;

}

let b = collectDOMStat(document.body);

console.log(b);
// console.log(++b.tags.DIV);