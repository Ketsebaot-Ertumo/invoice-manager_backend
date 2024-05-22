const {sequelize} = require('../models/index')
const DataTypes = require('sequelize')
const User = require('../models/userModel')(sequelize, DataTypes);



//show a user
exports.aUser = async (req, res) => {
    try{
        if (!req.params.id) {
          return res.status(400).json({ message: 'Please use an id!' });
        }
        const user = await User.findOne({where: {id: req.params.id}, attributes: ['id','fullName','email','phone','role','created_at'], });
        return res.status(200).json({success: true, user});
    }catch(err){
        console.error(err);
        return res.status(500).json({success: false, message:'Failed to show a user.', error:err.message});
    }
}


//show a profile
exports.profile = async (req, res) => {
  try{
      const profile = await User.findOne({where: {id: req.user.id}, attributes: ['id','fullName','email','phone','role','created_at'], });
      return res.status(200).json({success: true, profile});
  }catch(err){
      console.error(err);
      return res.status(500).json({success: false, message:'Failed to show a profile!', error:err.message});
  }
}


//show all users
exports.showUsers = async (req, res, next) => {
  try {
    if(req.params.id){

    }
    const users = await User.findAll({
      attributes: ['id','fullName','email','phone','role','created_at'],
      order: [['created_at', 'ASC']], // Sorting by created_at in ascending order
    });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    console.log('error occurred', err);
    return res.status(500).json({ success: false,message: 'Failed to show all users.', error: err.message });
  }
};



//delete a user
exports.deleteUser = async (req, res, next) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ message: 'Please use an id!' });
      }
      const user = await User.findOne({ where: { id : req.params.id } });
      if (!user) {
        return res.status(404).json({ message: 'User not found or has been deleted before!' });
      }
      await user.destroy();
      return res.status(200).json({message: 'User deleted successfully',});
    } catch (err) {
      return res.status(500).json({success: false,message: 'Failed to delete a user', error: err.message,});
};
}


 //user detail update
 exports.update = async (req, res, next) => {
    const { id, ...updates } = req.body;
  
    try {
        if (!req.params.id) {
            return res.status(400).json({ success: false, message: 'Please use a user id!' });
        }
        const user = await User.findOne({where: {id: req.params.id}});
        if(!user){
            return res.status(404).json({success:false,message: 'User not found.'});
        }
        const [updatedCount, [updatedUser]] = await User.update(updates, { where: { id:req.params.id }, returning: true });
    
        if (updatedCount === 0) {
            return res.status(304).json({ success: false, message: 'User has no update!' });
        }
  
        return res.status(200).json({ success: true, updatedUser});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message:'Server Error, unable to update a user detail!', error: err.message });
    }
  };



  //user role list
exports.getRoleList = async (req, res) => {
    try{
        const roleList = await User.findAll({
            attributes: [[sequelize.literal('DISTINCT "role"'), 'role']],
            raw: true,
          });
        return res.status(200).json({success: true, roleList});
    }catch(err){
        console.error(err);
        return res.status(500).json({success: false, message:'Failed to show role list.', error:err.message});
    }  
  }

