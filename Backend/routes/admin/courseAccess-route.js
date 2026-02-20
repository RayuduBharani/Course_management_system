const express = require('express');
const { CourseDeletion } = require('../../Controllers/admin/courseAccess');

const router = express.Router()

router.delete("/:id" , CourseDeletion)

module.exports = router