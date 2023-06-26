// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [selectedContactId, setSelectedContactId] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contacts`);
      setContacts(response.data);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  };

  const handleInputChange = e => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (selectedContactId) {
        await axios.put(`${API_BASE_URL}/contacts/${selectedContactId}`, newContact);
        const updatedContacts = contacts.map(contact => {
          if (contact.id === selectedContactId) {
            return { ...contact, ...newContact };
          }
          return contact;
        });
        setContacts(updatedContacts);
        setSelectedContactId('');
      } else {
        const response = await axios.post(`${API_BASE_URL}/contacts`, newContact);
        setContacts([...contacts, response.data]);
      }
      setNewContact({ name: '', phone: '', email: '' });
    } catch (error) {
      console.error('Failed to save contact:', error);
    }
  };

  const handleEdit = contact => {
    setSelectedContactId(contact.id);
    setNewContact({
      name: contact.name,
      phone: contact.phone,
      email: contact.email
    });
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`${API_BASE_URL}/contacts/${id}`);
      setContacts(contacts.filter(contact => contact.id !== id));
      if (selectedContactId === id) {
        setNewContact({ name: '', phone: '', email: '' });
        setSelectedContactId('');
      }
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  const handleSearch = e => {
    setSearchTerm(e.target.value);
  };

  const handleSort = e => {
    setSortOption(e.target.value);
  };

  const filteredContacts = contacts.filter(contact => contact.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (sortOption === 'name') {
    filteredContacts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === 'phone') {
    filteredContacts.sort((a, b) => a.phone.localeCompare(b.phone));
  } else if (sortOption === 'email') {
    filteredContacts.sort((a, b) => a.email.localeCompare(b.email));
  }

  return (
    <div className="App">
      <h1>Contact Management</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={newContact.name} onChange={handleInputChange} required />
        <input type="text" name="phone" placeholder="Phone" value={newContact.phone} onChange={handleInputChange} required />
        <input type="email" name="email" placeholder="Email" value={newContact.email} onChange={handleInputChange} required />
        <button type="submit">{selectedContactId ? 'Update Contact' : 'Add Contact'}</button>
      </form>
      <div className="filter">
        <input type="text" placeholder="Search by name" value={searchTerm} onChange={handleSearch} />
        <select value={sortOption} onChange={handleSort}>
          <option value="">Sort by</option>
          <option value="name">Name</option>
          <option value="phone">Phone</option>
          <option value="email">Email</option>
        </select>
      </div>
      <ul>
        {filteredContacts.map(contact => (
          <li key={contact.id}>
            <div>{contact.name}</div>
            <div>{contact.phone}</div>
            <div>{contact.email}</div>
            <button onClick={() => handleEdit(contact)}>Edit</button>
            <button onClick={() => handleDelete(contact.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
