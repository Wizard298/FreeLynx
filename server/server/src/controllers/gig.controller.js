const { Gig } = require('../models');
const { CustomException } = require('../utils');

const createGig = async (request, response) => {
    try {

        if (!request.isSeller) {
            throw CustomException('Only sellers can create new Gigs!', 403);
        }

        const gig = new Gig({
            userID: request.userID,
            ...request.body
        });
        await gig.save();
        return response.status(201).send(gig);
    }
    catch ({ message, status = 500 }) {
        return response.status(status).send({
            error: true,
            message
        })
    }
}

const deleteGig = async (request, response) => {
    const { _id } = request.params;

    try {
        const gig = await Gig.findOne({ _id });
        if (request.userID === gig.userID.toString()) {
            await Gig.deleteOne({ _id });
            return response.send({
                error: false,
                message: 'Gig had been successfully deleted!'
            })
        }

        throw CustomException('Invalid request! Cannot delete other user gigs!', 403);
    }
    catch ({ message, status = 500 }) {
        return response.status(status).send({
            error: true,
            message
        })
    }
}

const getGig = async (request, response) => {
    const { _id } = request.params;

    try {
        const gig = await Gig.findOne({ _id }).populate('userID', 'username country image createdAt email description');
        if (!gig) {
            throw CustomException('Gig not found!', 404);
        }
        return response.send(gig);
    }
    catch ({ message, status = 500 }) {
        return response.status(status).send({
            error: true,
            message
        })
    }
}

// search functionality
// const getGigs = async (request, response) => {
//     const { category, search, max, min, userID, sort } = request.query;
//     try {
//         const filters = {
//             ...(userID && { userID }),
//             ...(category && { category: { $regex: category, $options: 'i' } }),
//             ...(search && { title: { $regex: search, $options: 'i' } }),
//             ...((min || max) && {
//                 price: {
//                     ...(max && { $lte: max }),
//                     ...(min && { $gte: min }),
//                 },
//             })
//         }

//         const gigs = await Gig.find(filters).sort({ [sort]: -1 }).populate('userID', 'username cover email description isSeller _id image');
//         return response.send(gigs);
//     }
//     catch ({ message, status = 500 }) {
//         return response.status(status).send({
//             error: true,
//             message
//         })
//     }
// }

const getGigs = async (request, response) => {
    const { 
        userID,
        search, 
        min, 
        max, 
        location,
        category,
        sort 
    } = request.query;
    
    try {
        const filters = {
            ...(userID && { userID }),
            ...(search && { 
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { shortTitle: { $regex: search, $options: 'i' } },
                    { shortDesc: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } },
                    { location: { $regex: search, $options: 'i' } },
                    // { price: { $regex: search, $options: 'i' } },
                ]
            }),
            ...(category && { category: { $regex: category, $options: 'i' } }),
            ...(location && { location: { $regex: location, $options: 'i' } }),
            ...((min || max) && {
                price: {
                    ...(min && { $gte: parseInt(min) }),
                    ...(max && { $lte: parseInt(max) })
                }
            })
        }

        let sortOption = { [sort]: -1 };
        if (sort === 'price') sortOption = { price: 1 };
        if (sort === '-price') sortOption = { price: -1 };

        const gigs = await Gig.find(filters)
            .sort(sortOption)
            .populate('userID', 'username cover email description isSeller _id image');
            
        return response.send(gigs);
    }
    catch ({ message, status = 500 }) {
        return response.status(status).send({
            error: true,
            message
        })
    }
}

module.exports = {
    createGig,
    deleteGig,
    getGig,
    getGigs
}