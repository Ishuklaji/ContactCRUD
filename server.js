const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const contactsFilePath = path.join(__dirname, 'contacts.json');

// GET /api/contacts - for all contacts
app.get('/api/contacts', (req, res) => {
    fs.readFile(contactsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to read contacts data.' });
            return;
        }
        const contacts = JSON.parse(data);
        res.json(contacts);
    });
});

// GET /api/contacts/:id - for a specific contact by ID
app.get('/api/contacts/:id', (req, res) => {
    const contactId = req.params.id;
    fs.readFile(contactsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to read contacts data.' });
            return;
        }
        const contacts = JSON.parse(data);
        const contact = contacts.find(c => c.id === contactId);
        if (!contact) {
            res.status(404).json({ error: 'Contact not found.' });
            return;
        }
        res.json(contact);
    });
});

// POST /api/contacts - Create a new contact
app.post('/api/contacts', (req, res) => {
    const newContact = { id: uuidv4(), ...req.body };
    fs.readFile(contactsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to read contacts data.' });
            return;
        }
        const contacts = JSON.parse(data);
        contacts.push(newContact);
        fs.writeFile(contactsFilePath, JSON.stringify(contacts), 'utf8', err => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to create contact.' });
                return;
            }
            res.json(newContact);
        });
    });
});

// PUT /api/contacts/:id - Update an existing contact
app.put('/api/contacts/:id', (req, res) => {
    const contactId = req.params.id;
    const updatedContact = { id: contactId, ...req.body };
    fs.readFile(contactsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to read contacts data.' });
            return;
        }
        const contacts = JSON.parse(data);
        const index = contacts.findIndex(c => c.id === contactId);
        if (index === -1) {
            res.status(404).json({ error: 'Contact not found.' });
            return;
        }
        contacts[index] = updatedContact;
        fs.writeFile(contactsFilePath, JSON.stringify(contacts), 'utf8', err => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to update contact.' });
                return;
            }
            res.json(updatedContact);
        });
    });
});

// DELETE /api/contacts/:id - Delete a contact
app.delete('/api/contacts/:id', (req, res) => {
    const contactId = req.params.id;
    fs.readFile(contactsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to read contacts data.' });
            return;
        }
        const contacts = JSON.parse(data);
        const index = contacts.findIndex(c => c.id === contactId);
        if (index === -1) {
            res.status(404).json({ error: 'Contact not found.' });
            return;
        }
        contacts.splice(index, 1);
        fs.writeFile(contactsFilePath, JSON.stringify(contacts), 'utf8', err => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to delete contact.' });
                return;
            }
            res.json({ message: 'Contact deleted successfully.' });
        });
    });
});

// Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
