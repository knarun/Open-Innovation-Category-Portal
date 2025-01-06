const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// Test route (no auth required)
router.get('/test', (req, res) => {
  res.json({ message: 'Projects route is working' });
});

// Apply verifyToken middleware to all routes below this
router.use(verifyToken);

// Get user's project
router.get('/my-project', async (req, res) => {
  try {
    console.log('Getting project for user:', req.user);
    
    const project = await Project.findOne({ userId: req.user.id });
    console.log('Found project:', project);

    if (!project) {
      return res.status(404).json({ 
        message: 'No project found',
        userId: req.user.id
      });
    }

    res.json(project);
  } catch (err) {
    console.error('Error in my-project route:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create new project
router.post('/', async (req, res) => {
  try {
    const { projectTitle, components, teamMembers, flowChart } = req.body;
    const project = new Project({
      projectTitle,
      components,
      teamMembers,
      flowChart,
      userId: req.user.id
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(400).json({ message: err.message });
  }
});

// Admin routes
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('userId', 'name rollNo email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH route to update project status
router.patch('/:id/status', verifyAdmin, async (req, res) => {
  const { id } = req.params; // Get the project ID from the URL
  const { status } = req.body; // Get the new status from the request body

  console.log('Received PATCH request for project ID:', id);

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update the project status
    project.status = status;
    await project.save();

    res.status(200).json({ message: 'Project status updated successfully', project });
  } catch (error) {
    console.error('Error updating project status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;