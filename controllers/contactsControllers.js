import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContact as editContact,
  updateIsFavorite,
} from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
  updateContactStatusSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  const { id } = req.user;
  const contacts = await listContacts(id);
  res.json({
    status: "success",
    code: 200,
    data: contacts,
  });
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const contact = await getContactById(id);

  if (contact) {
    res.json({
      status: "success",
      code: 200,
      data: contact,
    });
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const contact = await removeContact(id);

  if (contact) {
    res.json({
      status: "success",
      code: 200,
      data: contact,
    });
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

export const createContact = async (req, res) => {
  const { error } = createContactSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      message: error.message,
    });
    return;
  }

  const user = req.user;
  const userId = user.id;

  const { name, email, phone } = req.body;
  const contact = await addContact(userId, name, email, phone);

  res.status(201).json({
    status: "success",
    code: 201,
    data: contact,
  });
};

export const updateContact = async (req, res) => {
  const { error } = updateContactSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      message: error.message,
    });
    return;
  }

  const { id } = req.params;
  const { name, email, phone } = req.body;
  if (!name && !email && !phone) {
    res.status(400).json({
      message: "Body must have at least one field",
    });
    return;
  }

  const contact = await editContact(id, name, email, phone);

  if (contact) {
    res.json({
      status: "success",
      code: 200,
      data: contact,
    });
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

export const updateStatusContact = async (req, res) => {
  const { error } = updateContactStatusSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      message: error.message,
    });
    return;
  }

  const { id } = req.params;
  const { favorite } = req.body;

  const contact = await updateIsFavorite(id, favorite);
  if (contact) {
    res.json({
      status: "success",
      code: 200,
      data: contact,
    });
  } else {
    res.status(404).json({ message: "Not found" });
  }
};
