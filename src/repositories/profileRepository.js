const JobSeekerProfile = require('../models/JobSeekerProfile');
const logger = require('../utils/loggerr');

const findByUserId = async (userId) =>{
    return await JobSeekerProfile.findOne({userId}).populate('userId', 'name, email,role');
};

const upsertProfile = async (userId , profileData) =>{
    const updatedProfile = await JobSeekerProfile.findOneAndUpdate(
        {userId},
        {$set : profileData},
        {
            new :true,
            upsert : true,
            runValidators : true
        }
    );

    logger.info('Jobseeker profile saved/updated Successfully :', userId);
    return updatedProfile;
};

module.exports = {findByUserId,upsertProfile};