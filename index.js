class Note {
    constructor(text, priority = 1) {
        this.value = text,
        this.priority = priority
    }

    static editNote(text, priority) {
        return {
            value: text,
            priority
        }
    }
}

class TodoApi {
    static baseUrl = 'https://todo.hillel.it';

    static async login(name, email) {
        const response = await fetch(`${this.baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                value: name + email
            })
        })
        
        const { access_token } = await response.json();
        return access_token;
    }

    static async postNote(objNote, token) {
        const response = await fetch(`${this.baseUrl}/todo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(objNote)
        })

        return await response.json();
    }

    static async putNote(idNote, editedNote, token) {
        return await fetch(`${this.baseUrl}/todo/${idNote}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(editedNote)
        })
    }

    static async getNote(idNote, token) {
        return fetch(`${this.baseUrl}/todo/${idNote}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${token}`
            },
        }).then(res => res.json())
    }

    static async getList(token) {
        const response = await fetch(`${this.baseUrl}/todo`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${token}`
            },
        })

        return await response.json();
    }

    static async deleteNote(idNumb, token) {
        fetch(`${this.baseUrl}/todo/${idNumb}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${token}`
            },
        })
    }

    static async putChecked(idNote, token) {
        return await fetch(`${this.baseUrl}/todo/${idNote}/toggle`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${token}`
            },
        })
    }
}

class ToDoList {
    token = null || localStorage.getItem('token');
    list = this.showList();

    async login(name, email) {
        const token = await TodoApi.login(name, email);
        this.token = token;

        localStorage.setItem('token', token)
    }

    async addNote(text, priority = 1) {
        const note = new Note(text, priority);

        const newNote = await TodoApi.postNote(note, this.token);
        this.list.push(newNote);

        console.log(newNote);
    }

    async getNote(idNote) {
        const note = await TodoApi.getNote(idNote, this.token);
        console.log(note);
    }

    async showList() {
        const list = await TodoApi.getList(this.token);
        this.list = list;
        console.log(this.list);
    }

    async editNote(idNote, text, priority = 1) {
        const editedNote = Note.editNote(text, priority);

        const result = TodoApi.putNote(idNote, editedNote, this.token);
    }

    async editChecked(idNote) {
        TodoApi.putChecked(idNote, this.token);
    }

    async deleteNote(idNote) {
        TodoApi.deleteNote(idNote, this.token);
    } 
}


const todo = new ToDoList;
// todo.login('denis', 'dev');



