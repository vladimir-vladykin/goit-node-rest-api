import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact
} from "../controllers/contactsControllers.js";
import { auth } from "../services/tokens.js";

const contactsRouter = express.Router();

contactsRouter.get("/", auth, getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", auth, createContact);

contactsRouter.put("/:id", updateContact);

contactsRouter.patch("/:id/favorite", updateStatusContact);

export default contactsRouter;
