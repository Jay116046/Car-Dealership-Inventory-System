import mongooes from 'mongoose'


const VehicleSchema = new mongooes.Schema({
    make: {
        type: String,
        required: [true, 'Vehicle make is required']
    },
    model: {
        type: String,
        required: [true, 'Vehicle model is required']
    },
    category: {
        type: String,
        required: [true, 'Vehicle category is required']
    },
    price: {
        type: Number,
        required: [true, 'Vehicle price is required'],
        min: [0, 'Price cannot be negative']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity in stock is required'],
        min: [0, 'Quantity cannot be less than zero']
    },
    imageUrl: {
        type: String,
        required: [false, 'Vehicle make is not required']
    }
}, { timestamps: true })


const Vehicle = mongooes.model('Vehicle', VehicleSchema)

export default Vehicle