export class ViewerMethods {
    urn;
    highLightNotes = [];
    constructor(urn) {
        this.urn = urn;
    }

    sendNotes(input) {
         fetch('/api/forge/notes/addObject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                urn: this.urn,
                idNoteObject: input.id,
                textNodeObject: input.value
            })
        }).then(res => {
            if (res.ok) {
                alert("ok!");
                document.location.reload();
                this.deleteInput();
            }
        })
    }

    deleteInput() {
        const paras = document.getElementsByClassName('input_note');
        while(paras[0]) {
            paras[0].parentNode.removeChild(paras[0]);
        }
    }

    getNotes() {
        fetch(`/api/forge/notes/getObject?urn=${this.urn}`)
            .then(res => res.json())
            .then(res => {
            })
    }

    highlightNote(viewer) {
        this.hideHighLightNote(viewer)
        const notes = document.querySelectorAll('.objectNotes');
        for (let note of notes) {
            note.onclick = () => {
                this.highLightNotes.push(+note.id);
                viewer.impl.highlightObjectNode(
                    viewer.model, +note.id, true, true);
            };
        }
    }

    hideHighLightNote(viewer) {
        let htmlDiv = document.getElementById('forgeViewer');
        htmlDiv.onclick = () => {
            this.highLightNotes.map(id => {
                viewer.impl.highlightObjectNode(
                    viewer.model, +id, false, false);
            })
        }
    }

    createNote(id) {
        let htmlDiv = document.getElementById('forgeViewer');
        this.deleteInput();
        const input = document.createElement('input');
        const inputSubmit = document.createElement('input');
        input.classList.add('input_note');
        inputSubmit.classList.add('input_note');
        input.type = 'text';
        inputSubmit.type = 'submit';
        input.id = id;
        inputSubmit.onclick = () => this.sendNotes(input);
        const style = `
                            position: relative;
                            background-color: rgba(34,34,34,.94);
                            color: white;
                            box-shadow: 1px 3px 10px 0 rgb(0 0 0 / 50%);
                            top: 15px; 
                            left: 43%; 
                            z-index: 5;
                            border: none;
                            height: 27px;
                            outline: none; 
                        `;
        input.style.cssText = style;
        inputSubmit.style.cssText = style + `
                            height: 27px;    
                        `;
        htmlDiv.appendChild(input);
        htmlDiv.appendChild(inputSubmit);
    }
}