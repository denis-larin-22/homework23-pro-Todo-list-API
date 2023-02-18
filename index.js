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
        const response = await fetch(`${this.baseUrl}/todo`, this.requestParamWithObj('POST', token, objNote))

        return await response.json();
    }

    static async putNote(idNote, editedNote, token) {
        return await fetch(`${this.baseUrl}/todo/${idNote}`, this.requestParamWithObj('PUT', token, editedNote))
    }

    static async getNote(idNote, token) {
        return fetch(`${this.baseUrl}/todo/${idNote}`, this.requestParam('GET', token)).then(res => res.json())
    }

    static async getList(token) {
        const response = await fetch(`${this.baseUrl}/todo`, this.requestParam('GET', token))

        return await response.json();
    }

    static async deleteNote(idNumb, token) {
        fetch(`${this.baseUrl}/todo/${idNumb}`, this.requestParam('DELETE', token))
    }

    static async putChecked(idNote, token) {
        return await fetch(`${this.baseUrl}/todo/${idNote}/toggle`,this.requestParam('PUT', token))
    }

    static requestParamWithObj(method, token, obj) {
        return {
            method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(obj)
        }
    }

    static requestParam(method, token) {
        return {
            method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${token}`
            },
        }
    }
}


class ToDoList {
    token = null ?? localStorage.getItem('token');
    list = this.getList();

    async login(name, email) {
        const token = await TodoApi.login(name, email);
        this.token = token;

        localStorage.setItem('token', token)
    }

    async addNote(text, priority = 1) {
        const note = new Note(text, priority);

        const newNote = await TodoApi.postNote(note, this.token);
        this.list.push(newNote);
    }

    async getNote(idNote) {
        const note = await TodoApi.getNote(idNote, this.token);
        console.log(note);
    }

    async getList() {
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


