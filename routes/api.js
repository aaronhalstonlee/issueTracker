/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
require('dotenv').config()
const expect      = require('chai').expect;
const shortId     = require('shortid');
//const mongo       = require('mongodb').MongoClient;
const ObjectId    = require('mongodb').ObjectID;
const mongoose    = require('mongoose');
const URL       = process.env.MONGO_URI; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

mongoose.connect(URL,{useNewUrlParser:true});
const Schema    = mongoose.Schema;
const Projects = new Schema({
  //_id: String,
  issue_title: String,
  issue_text: String,
  created_by: String,
  created_on: {
    type: Date,
    default: Date.now()
  },
  updated_on: {
    type: Date,
    default: Date.now()
  },
  open: {
    type: Boolean,
    default: true
  },
  assigned_to: String,
  status_text: String
});



module.exports = (app)=>{
       
  app.route('/api/issues/:project')
    .get((req, res)=>{
      const project = req.params.project
      const Project = mongoose.model(project, Projects);
      console.log(req.query);
      if(Object.keys(req.query).length < 1){
        Project.find({}, (err, issues)=>{
          if(err) throw(err)
          res.json(issues);
        })
      } else {
        const query = req.query;
        Project.find(query, (err, issues)=>{
          if(err) throw(err);
          res.json(issues);
        })
      }
    })
  
    .post((req, res)=>{
      var project = req.params.project
      const Project = mongoose.model(project, Projects);
      if(req.body){
        const issue = new Project(req.body);
        issue.save((err, saved)=>{
          if(err) throw(err);
          res.json({
            issue_title: saved.issue_title,
            issue_text: saved.issue_text,
            created_by: saved.created_by
          })
        })
      } else {
        res.send('please fill in the form');
      }
    })
  
    .put((req, res)=>{
      var project = req.params.project;
      const id = req.body._id;
      const Project = mongoose.model(project, Projects);
      Project.findById(id, (err, doc)=>{
        if(err) throw(err);
        if(!req.body.issue_title && !req.body.issue_text && !req.body.created_by && !req.body.assigned_to && !req.body.status_text){
          res.send('no updated field sent');
        } else if(!doc) {
          res.send('could not update ' + id);
        } else {
          //console.log(doc);
          if(req.body.issue_title) doc.issue_title = req.body.issue_title;
          if(req.body.issue_text) doc.issue_text = req.body.issue_text;
          if(req.body.created_by) doc.created_by = req.body.created_by;
          if(req.body.assigned_to) doc.assigned_to = req.body.assigned_to;
          doc.created_on = doc.created_on;
          doc.updated_on = Date.now();
        
          doc.save((err, saved)=>{
            if(err) throw(err)
            res.send('successfully updated');
          })
        }
      });
    })
  
    .delete((req, res)=>{
      var project = req.params.project;
      const Project = mongoose.model(project, Projects);
      Project.findOneAndDelete({_id: req.body._id}, (err, deleted)=>{
        if(err) throw(err);
        res.json('successfully deleted: ' + deleted);
      })
    });
  //end route
};