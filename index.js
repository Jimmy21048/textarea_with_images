// import axios from "axios";

function insertImage() {
    document.getElementById("fileinput").click();
}

const existing = document.getElementById('saved-work')
let length = 0
let maxLength
let data1 = []
function getNotes() {
    fetch('http://localhost:3000/getNotes', {
        method : 'GET',
    }).then(response => response.json())
    .then(data => {
        console.log(data)
        data1 = data
        maxLength = data.results.length - 1
        // console.log(length)
        existing.innerHTML = data.results[length].text_content
        existing.querySelector('img').src = data.imgs[length]
    })
}
getNotes()

const prev = () => {
    if(length < 1) {
        length = maxLength
    } else {
        length--
    }
    existing.innerHTML = data1.results[length].text_content
    existing.querySelector('img').src = data1.imgs[length]
}

const next = () => {
    if(length == maxLength) {
        length = 0
    } else {
        length++
    }
    existing.innerHTML = data1.results[length].text_content
    existing.querySelector('img').src = data1.imgs[length]
}

let file
document.getElementById("fileinput").addEventListener('change', (event) => {
    file = event.target.files[0];

    if(file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = document.createElement('img');
            
            img.src = e.target.result;

            const selection = window.getSelection();

            if(selection.rangeCount > 0) {
                const range = selection.getRangeAt(0)

                range.deleteContents();
                range.insertNode(img);

                range.setStartAfter(img);
                range.setEndAfter(img);
                selection.removeAllRanges();
                selection.addRange(range);

            }
        }
        reader.readAsDataURL(file);
    }
    event.target.value = "";
    console.log(file)

})

const editor = document.getElementById("editor");

function submit() {
    let randomNumber = Math.floor(Math.random() * (1000 - 1 +1) + 1)
    editor.querySelector('img').src = `${randomNumber}`
    const data = { d : editor.innerHTML};

    // console.log(data.d)

    const formData = new FormData();
    formData.append('image', file)
    formData.append('text', data.d)
    // console.log(editor.innerHTML)

    fetch('http://localhost:3000/upload-image', {
        method : 'POST',
        body: formData
    })
    .then(response).then(data => {
        console.log(data)
    }) 

    
}