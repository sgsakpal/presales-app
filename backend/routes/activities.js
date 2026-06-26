const express = require('express')
const { PrismaClient } = require('@prisma/client')
const router = express.Router()
const prisma = new PrismaClient()

// Get all activities
router.get('/', async (req, res) => {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json(activities)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get activities for a specific lead
router.get('/lead/:leadId', async (req, res) => {
  try {
    const activities = await prisma.activity.findMany({
      where: { leadId: req.params.leadId },
      orderBy: { createdAt: 'desc' }
    })
    res.json(activities)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create activity
router.post('/', async (req, res) => {
  try {
    const activity = await prisma.activity.create({ data: req.body })
    res.json(activity)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Mark complete / update
router.patch('/:id', async (req, res) => {
  try {
    const activity = await prisma.activity.update({
      where: { id: req.params.id },
      data: req.body
    })
    res.json(activity)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete activity
router.delete('/:id', async (req, res) => {
  try {
    await prisma.activity.delete({ where: { id: req.params.id } })
    res.json({ message: 'Activity deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router