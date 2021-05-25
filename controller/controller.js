var User = require('../models/user');

exports.find = (req, res) => {

    if(req.query.id){
        const id = req.query.id;

        User.findById(id)
        .then(data => {
            if(!data)
            {
                res.status(404).send({message: "User not found"})
            }
            else
            {
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({message: "Error retrieving user"})
        })
    }
    else
    {
        User.find()
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            res.status(500).send({message: err.message || "Error while retrieving user info."})
        })
    }
    
}

exports.update = (req, res) => {
    if(!req.body)
    {
        return res
            .status(400)
            .send({message: "Data to update cannot be empty"});
    }

    const id = req.params.id;
    User.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
        .then(data => {
            if(!data)
            {
                res.status(404).send({message: 'Cannot update user with ${id}. User not found'});
            }
            else
            {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({message: "Error update user info"})
        })
       
}

exports.delete = (req, res) => {
    const id = req.params.id;

    User.findByIdAndDelete(id)
        .then(data => {
            if(!data)
            {
                res.status(404).send({message: "Cannot delete ID"})
            }
            else
            {
                res.send({
                    message: "User deleted successfully!"
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete user"
            });
        });
}