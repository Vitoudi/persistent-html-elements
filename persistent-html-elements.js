function checkForPersistentElements() {
    if(localStorage.length) {
        const elements = []
        Object.keys(localStorage).forEach(item => {
            console.log(item);
            if (!item.startsWith("my")) return;

            const elementObj = JSON.parse(localStorage.getItem(item));
            const element = elementObj.element;

            const id = element
              .match(/id="(.*)"/m)[1]
              .match(/([^\s]+)/)[0]
              .replace('"', "");

            if (isInHTML(id)) return;

            if(localStorage.getItem('avoid') === id) return

            elements.push(element);
            printElement(elementObj);
        }) 
    }

    function printElement(elementObj) {
        if (elementObj.mode === "default") {
          document.body.innerHTML += elementObj.element;
        } else if (
          elementObj.mode === "afterend" ||
          elementObj.mode === "afterstart" ||
          elementObj.mode === "beforebegin" ||
          elementObj.mode === "'beforeend'"
        ) {
          document.addEventListener("DOMContentLoaded", () => {
            const referenceElement = document.getElementById(
              elementObj.referenceElement
            );

            const newElement = document.createElement("div");
            newElement.innerHTML = elementObj.element;

            referenceElement.insertAdjacentElement(elementObj.mode, newElement);
          });
        } else {
          throw new Error("Invalid insertion method: " + elementObj.mode + ', fix the error, clean your local storage and try again');
        }
        
    }
}

function avoidPersistence(id) {
    console.log(Array.isArray(id))
    localStorage.setItem('avoid', id)
}

function makePersist(element, insertionMethod, referenceElement) {
        function isValidElement() {
            if(!element) return false
            if(!isInHTML(element.id)) {
                return false}
            if(!element.id) throw new Error('Every element must have an id value')

            return true
        }

        if(!isValidElement()) return
        let tag = element.tagName.toLowerCase()
        let content = element.innerHTML

        const persistentElement = `<${tag.toLowerCase()} id="${
          element.id
        }" class="${element.classList}">${content}</${tag.toLowerCase()}>`;

        putElementInLocalStorage(element.id, JSON.stringify({
            element: persistentElement,
            mode: insertionMethod || 'default',
            referenceElement: referenceElement || 'body'
        }))

    function putElementInLocalStorage(id, element) {
        if(localStorage.getItem(id)) return
        localStorage.setItem(id, element)
    } 
}

function isInHTML(id) {
  if (document.querySelector(`#${id}`)) {
    return true;
  } else {
    return false;
  }
}

checkForPersistentElements()