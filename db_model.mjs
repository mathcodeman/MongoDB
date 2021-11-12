import mongoose from 'mongoose'

mongoose.connect(
    'mongodb://localhost:27017/information',
    { useNewUrlParser: true }
);

const db = mongoose.connection;

db.once('open', () => {
    console.log('We successfully connected to Mongo using Mongoose!!')
});

mongoose.set('useCreateIndex', true)

//Creating model for our database
const informationSchema = mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: false }
});

//Compile the model from the schema.
const information = mongoose.model("Information", informationSchema)

const createPerson = async (name, age, email, phoneNumber) => {
    const Person = new information({ name: name, age: age, email: email, phoneNumber: phoneNumber })
    return Person.save()
}

const retievePerson = async (filter) => {
    const detail = information.find()
    if (filter.length > 0) {
        detail.and(filter)
    }
    return detail.exec()

}

const updatePerson = async (_id, filter) => {
    const result = await information.updateMany({ _id: _id }, filter);
    return result.nModified
}

const deletePerson = async (filter) => {
    const query = information.deleteMany()
    if (filter.length > 0) {
        query.or(filter)
    }
    const exec = query.exec()
    return (await exec).deletedCount
}

export { createPerson, retievePerson, updatePerson, deletePerson };

