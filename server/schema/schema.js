const _ = require('lodash');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');

// Import Mongoose models — replace paths if needed
const Project = require('../models/project');
const Task = require('../models/task');

// Dummy data for testing purposes — remove when fully using MongoDB
const projects = [
  {
    id: '1',
    title: 'Advanced HTML',
    weight: 1,
    description: `Welcome to the Web Stack specialization. The first three projects cover the basics of Web development: HTML, CSS, and developer tools. This project teaches you how to use HTML tags to structure a webpage. No CSS or styling yet — that’s okay! Just focus on the structure. Details matter, so be careful with case and syntax!`
  },
  {
    id: '2',
    title: 'Bootstrap',
    weight: 1,
    description: `Bootstrap is a popular, open-source CSS framework for responsive, mobile-first front-end development. It provides ready-to-use CSS and JavaScript components like buttons, forms, navigation, and more.`
  }
];

const tasks = [
  {
    id: '1',
    title: 'Create your first webpage',
    weight: 1,
    description: `Create your first HTML file, 0-index.html, with:
- A doctype declaration on the very first line (no comments here)
- An opening and closing <html> tag right after the doctype
Open this file in your browser — it should be a blank page.`
    ,
    projectId: '1'
  },
  {
    id: '2',
    title: 'Structure your webpage',
    weight: 1,
    description: `Copy everything from 0-index.html into 1-index.html.
Add <head> and <body> tags inside the <html> tag. For now, keep them empty.`
    ,
    projectId: '1'
  }
];

// Define the TaskType with lazy fields to handle circular references
const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    weight: { type: GraphQLInt },
    description: { type: GraphQLString },
    project: {
      type: ProjectType,
      resolve(parent, args) {
        // Fetch the project related to this task using the projectId field
        // Use this if you're working with dummy data:
        // return _.find(projects, { id: parent.projectId });
        
        // Use this if connected to MongoDB:
        return Project.findById(parent.projectId);
      }
    }
  })
});

// Define the ProjectType with lazy fields for circular refs
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    weight: { type: GraphQLInt },
    description: { type: GraphQLString },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent, args) {
        // Get all tasks that belong to this project
        
        // For dummy data:
        // return _.filter(tasks, { projectId: parent.id });
        
        // For MongoDB:
        return Task.find({ projectId: parent.id });
      }
    }
  })
});

// Root queries for fetching data
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    task: {
      type: TaskType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // Find a single task by ID
        // return _.find(tasks, { id: args.id });
        return Task.findById(args.id);
      }
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // Find a single project by ID
        // return _.find(projects, { id: args.id });
        return Project.findById(args.id);
      }
    },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve() {
        // Return all tasks
        // return tasks;
        return Task.find({});
      }
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve() {
        // Return all projects
        // return projects;
        return Project.find({});
      }
    }
  }
});

// Mutations to add new data to the database
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addProject: {
      type: ProjectType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        weight: { type: new GraphQLNonNull(GraphQLInt) },
        description: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        // Create a new Project document and save it to MongoDB
        const project = new Project({
          title: args.title,
          weight: args.weight,
          description: args.description
        });
        return project.save();
      }
    },
    addTask: {
      type: TaskType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        weight: { type: new GraphQLNonNull(GraphQLInt) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        projectId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        // Create a new Task document linked to a project, then save it
        const task = new Task({
          title: args.title,
          weight: args.weight,
          description: args.description,
          projectId: args.projectId
        });
        return task.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
