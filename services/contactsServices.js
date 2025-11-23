import { promises as fs } from "fs";
import { join } from "path";
import { Contact } from "../db/db.js";

// TODO remove
const contactsPath = join("db", "contacts.json");

async function listContacts() {
  const contacts = await Contact.findAll();
  return contacts;
}

async function getContactById(contactId) {
  if (isInvalidId(contactId)) {
    console.log(`Invalid id ${contactId}`);
    return null;
  }

  const contact = await Contact.findOne({
    where: {
      id: contactId,
    },
  });

  return contact || null;
}

async function removeContact(contactId) {
  if (isInvalidId(contactId)) {
    console.log(`Invalid id ${contactId}`);
    return null;
  }

  const contact = await getContactById(contactId);
  if (!contact) return null;

  await Contact.destroy({
    where: {
      id: contactId,
    },
  });

  return contact;
}

async function addContact(name, email, phone) {
  const contact = await Contact.create({
    name: name,
    email: email,
    phone: phone,
  });

  return contact;
}

async function updateContact(id, name, email, phone) {
  const contact = await getContactById(id);

  if (!contact) {
    return null;
  }

  if (name) contact.name = name;
  if (email) contact.email = email;
  if (phone) contact.phone = phone;

  const allContacts = await listContacts();
  const updatedContacts = allContacts.map((element) => {
    return element.id == id ? contact : element;
  });

  await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
  return contact;
}

function isInvalidId(contactId) {
  return isNaN(parseInt(contactId, 10));
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
