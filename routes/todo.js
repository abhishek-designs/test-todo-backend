// Importing modules
const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/validateRoute");
const Todo = require("../model/TodoItem");

// Creating routes (CRUD)

// @method      GET
// @desc        To fetch all the user's saved contacts
// @access      Private
// @endpoint    /api/contact
router.get("/", auth, async (req, res) => {
  // Extracting user's id
  const _id = req.user;

  // Carry out the user's saved contacts
  try {
    const todos = await Todo.find({ user: _id });
    if (todos.length === 0) return res.send("");

    res.json(todos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @method      POST
// @desc        To add a contact
// @access      Private
// @endpoint    /api/contact
router.post(
  "/",
  auth,
  body("title")
    .not()
    .isEmpty()
    .withMessage("title should not be empty")
    .isLength({ min: 4 })
    .withMessage("title should contain atleast 4 characters"),
  body("description")
    .not()
    .isEmpty()
    .withMessage("description should not be empty")
    .isLength({ min: 4 })
    .withMessage("description should contain atleast 4 characters"),
  async (req, res) => {
    // Extracting user's id
    const _id = req.user;

    // First extracting all the user's contact details through request body
    const { title, description } = req.body;

    // Now doing some validations
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(400).json(error);

    // Storing contact into the database
    try {
      const todo = new Todo({
        title,
        description,
        user: _id,
      });

      // Save the contact to the database
      const newTodo = await todo.save();
      res.status(201).json({ msg: "Todo saved", newTodo });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @method      PUT
// @desc        To update an existing contact
// @access      Private
// @endpoint    /api/contact/:contactid
router.put(
  "/:todoid",
  auth,
  body("title")
    .not()
    .isEmpty()
    .withMessage("title should not be empty")
    .isLength({ min: 4 })
    .withMessage("title should contain atleast 4 characters"),
  body("description")
    .not()
    .isEmpty()
    .withMessage("description should not be empty")
    .isLength({ min: 4 })
    .withMessage("description should contain atleast 4 characters"),
  async (req, res) => {
    // Extracting user's id
    const _id = req.user;

    // Validating contact details
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(400).json(error);

    // If all the details are valid then we have to specify the user should be the account holder not a stranger
    try {
      const { user } = await Todo.findById(req.params.todoid);
      if (_id !== user.toString())
        // The user id in the database is the object so we have to convert into the string
        return res.status(401).json({ msg: "You are not a valid user" });

      // If the user is valid then He/She can freely update the contacts
      const updatedTodo = await Todo.findOneAndUpdate(
        { _id: req.params.todoid },
        req.body,
        { new: true } // Show the updated contact
      );
      res.json({ msg: "todo updated", updatedTodo });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @method      DELETE
// @desc        To delete a contact
// @access      Private
// @endpoint    /api/contact/:contactid
router.delete("/:todoid", auth, async (req, res) => {
  // Extracting user's id
  const _id = req.user;

  // Restrict the stranger to access and delete other user's contact
  try {
    const { user } = await Todo.findById(req.params.todoid);
    if (_id !== user.toString())
      return res.status(401).json({ msg: "You are not a valid user" });

    // Proceed the deletion process
    await Todo.findOneAndDelete({ _id: req.params.todoid });
    res.json({ msg: "todo deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Exporting module
module.exports = router;
