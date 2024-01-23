// Create web server application
// 1. Create web server
const express = require('express');
const app = express();
// 2. Create web server
const server = require('http').createServer(app);
// 3. Create web socket server
const io = require('socket.io')(server);
// 4. Create mongoose
const mongoose = require('mongoose');
// 5. Connect mongoose to mongodb
mongoose.connect('mongodb://localhost:27017/meanstack', {useNewUrlParser: true});
// 6. Create Schema
const Schema = mongoose.Schema;
// 7. Define Schema
const commentSchema = new Schema({
    username: String,
    comment: String
});
// 8. Create model
const Comment = mongoose.model('comment', commentSchema);
// 9. Create body parser
const bodyParser = require('body-parser');
// 10. Configure body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// 11. Create router
const router = express.Router();
// 12. Create port
const port = process.env.PORT || 5000;
// 13. Create middleware
router.use(function(req, res, next) {
    console.log('middleware');
    next();
});
// 14. Create route
router.get('/', function(req, res) {
    res.json({message: 'Welcome to meanstack'});
});
// 15. Create route
router.route('/comments').post(function(req, res) {
    const comment = new Comment();
    comment.username = req.body.username;
    comment.comment = req.body.comment;
    comment.save(function(err) {
        if (err) {
            res.send(err);
        }
        res.json({message: 'Comment successfully added'});
    });
}).get(function(req, res) {
    Comment.find(function(err, comments) {
        if (err) {
            res.send(err);
        }
        res.json(comments);
    });
});
// 16. Create route
router.route('/comments/:comment_id').put(function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
        if (err) {
            res.send(err);
        }
        comment.comment = req.body.comment;
        comment.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({message: 'Comment has been updated'});
        });
    });
}).delete(function(req, res) {