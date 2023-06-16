const express = require("express");

const contactsControl = require("../../controllers/contacts/index");
const {
  contactsJoiScheme,
  contactUpdateFavoriteJoiSchema,
} = require("../../schemas/joi-contacts");
const { HttpError } = require("../../helpers");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await contactsControl.getAllContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsControl.getContactById(id);
    if (!result) {
      throw HttpError(404, `Contact with id ${id} was not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactsJoiScheme.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contactsControl.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsControl.removeContact(id);
    if (!result) {
      throw HttpError(404, `Contact with id ${id} was not found.`);
    }
    res.status(200).json({ message: "Contact was successfully deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { error } = contactsJoiScheme.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const result = await contactsControl.updateContact(id, req.body);
    if (!result) {
      throw HttpError(404, `Contact with id ${id} was not found.`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/favorite", async (req, res, next) => {
  try {
    const { error } = contactUpdateFavoriteJoiSchema.validate(req.body);
    if (error) {
      throw HttpError(400, "Missing field favorite");
    }
    const { id } = req.params;
    const result = await contactsControl.updateStatusContact(id, req.body);
    if (!result) {
      throw HttpError(404, `Contact with id ${id} was not found.`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
