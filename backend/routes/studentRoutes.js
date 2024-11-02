const express = require("express")
const router = express.Router()
const studentController = require("../controllers/studentController")

router.get("/", studentController.getAllStudents)
router.get("/:id", studentController.getStudentById)
router.get("/code/:student_code", studentController.getStudentByCode)
router.post("/", studentController.createStudent)
router.put("/:id", studentController.updateStudent)
router.delete("/:id", studentController.deleteStudent)

module.exports = router
