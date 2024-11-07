// import axios from "axios";

function insertImage() {
    document.getElementById("fileinput").click();
}

let file
document.getElementById("fileinput").addEventListener('change', (event) => {
    file = event.target.files[0];

    if(file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = document.createElement('img');
            
            img.src = e.target.result;
            // console.log(file)

            const selection = window.getSelection();

            // console.log(selection.rangeCount)

            if(selection.rangeCount > 0) {
                const range = selection.getRangeAt(0)

                range.deleteContents();
                range.insertNode(img);

                range.setStartAfter(img);
                range.setEndAfter(img);
                selection.removeAllRanges();
                selection.addRange(range);

                // console.log(img.src);
            }
        }
        reader.readAsDataURL(file);
    }
    event.target.value = "";

})

const editor = document.getElementById("editor");

function submit() {
    editor.querySelector('img').src = ""
    const data = { d : editor.innerHTML};

    // console.log(data.d)

    const formData = new FormData();
    formData.append('image', file)
    formData.append('text', data.d)
    // console.log(editor.innerHTML)

    fetch('http://localhost:3000/upload-image', {
        method : 'POST',
        // headers : { 'Content-Type' : 'application/json' },
        body: formData
    })
    // .then(response => response.json())   
    // .then(data => {
    //     if(data.url) {
    //         console.log("Image ", data.url, " uploaded")
    //     }
    // }).catch(err => console.log(err))
}