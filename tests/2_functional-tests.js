/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var updateData;

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       let data = {
          issue_title: 'Titlepo',
          issue_text: 'textpo',
          created_by: 'Functi8yonal Test - Every field filled in',
          assigned_to: 'Chai anktd Mocha',
          status_text: 'In QAiyf'
        } 
       chai.request(server)
        .post('/api/issues/test')
        .send(data)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isNotNull(res.body.issue_title, 'should have a title');
          assert.isNotNull(res.body.issue_text, 'should have text');
          assert.isNotNull(res.body.created_by, 'should have created by');
          assert.isNotNull(res.body.assigned_to, 'should have assigned');
          assert.isNotNull(res.body.status_text, 'should have status text');
          //fill me in too!
          
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        let data = {
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in'
        }
        chai.request(server)
          .post('/api/issues/test')
          .send(data)
        .end(function(err,res){
          assert.isNotNull(res.body.issue_title, 'should have a title');
          assert.isNotNull(res.body.issue_text, 'should have text');
          assert.isNotNull(res.body.created_by, 'should have created by');
          done();
        });
      });
      
      test('Missing required fields', function(done) {
        let data = {
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in'
        }
        chai.request(server)
          .post('/api/issues/test')
          .send(data)
        .end(function(err,res){
          assert.isNotNull(res.body.issue_title, 'should have a title');
          assert.isNotNull(res.body.issue_text, 'should have text');
          assert.isNotNull(res.body.created_by, 'should have created by');
          done();
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      
      before(function(done){
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title',
            issue_text: 'text',
            created_by: 'aaron'
          })
          .end(function(err, res){
            //done();
          })
        
        chai.request(server)
          .get('/api/issues/test')
          .send({})
          .end(function(err, res){
            updateData = {
              _id: res.body[0]._id,
              issue_title: 'updated Title',
              issue_text: 'updated text',
              created_by: 'updated Functional Test - Every field filled in',
              assigned_to: 'updated Chai and Mocha',
              status_text: 'updated In QA' 
            }
            //console.log(updateData);
            done()
          })
      })
      
      
      
      //console.log(updateData)
      
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send(updateData)
        .end(function(err,res){
          assert.isNotNull(res.body, 'has body')
          done();
        });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send(updateData)
        .end(function(err,res){
          //console.log(updateData);
          assert.equal(res.text, 'successfully updated')
          done();
        });
      });
      
      test('Multiple fields to update', function(done) {
        updateData.issue_title = 'updated again Title';
        chai.request(server)
          .put('/api/issues/test')
          .send(updateData)
          .end(function(err,res){
            assert.equal(res.text, 'successfully updated');
            assert.notEqual(res.issue_title, updateData.issue_title);
            done();
          })
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          //console.log(res.body)[0];
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], '_id'&&'issue_title'&&'issue_text'&&'created_by'&&'created_on'&&'updated_on');
          done();
        });
      });
      
      test('One filter', function(done) {
        let query = {open: true};
        chai.request(server)
          .get('/api/issues/test')
          .query(query)
          .end(function(err,res){
            assert.equal(res.body[0].open, query.open);
            done();
          })
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        let queryHere = {
          open: true,
          status_text: 'In QA'
        };
        
        chai.request(server)
          .get('/api/issues/test')
          .send(queryHere)
          .end(function(err, res){
            //console.log(res.body[0], queryHere)
            assert.isArray(res.body);
            assert.equal(res.body[0].open, queryHere.open)
            //assert.equal(res.body[0].status_text, queryHere.status_text)
            done()
          })
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({})
          .end(function(err, res){
            if(err) throw(err)
            assert.equal(res.text, '_id error')
            done()
        })
      });
      
      test('Valid _id', function(done) {
        
        chai.request(server)
          .delete('/api/issues/test')
          .send({_id: updateData._id})
          .end(function(err, res){
            if(err) throw(err)
            //console.log();
            assert.equal(res.text, '"'+"successfully deleted: " +updateData._id+'"')
            done()
          })
      });
      
    });

});
