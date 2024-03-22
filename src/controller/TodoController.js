const TodoModel = require('../models/TodoModel')


// Create Todo Start
exports.CreateTodo = async (req, res) => {
    try {
        const reqBody = req.body
        reqBody.email = req.headers.email
        const todo = await TodoModel.create(reqBody)
        res.status(200).json({ status: "success", data: todo })
    }
    catch (error) {
        res.status(200).json({ status: "fail", data: error })
    }
} 
// Create Todo End

// Update Todo Status Start 
exports.UpdateTodoStatus  = async (req, res) => {
    try {
        let id = req.params.id
        let status = req.params.status
        let query = { _id: id }
        let body = { status: status }
        let todo = await TodoModel.updateOne(query, body)
        res.status(200).json({ status: "success", data: todo })
    }
    catch (error) {
        res.status(200).json({ status: "fail", data: error })
    }
}
// Update Todo Status End 

// Delete Todo Start
exports.DeleteTodo = async (req, res) => {
    try {
        let id = req.params.id
        let query = { _id: id }
        let todo = await TodoModel.deleteOne(query)
        res.status(200).json({ status: "success", data: todo })
    }
    catch (error) {
        res.status(200).json({ status: "fail", data: error })
    }
}
// Delete Todo End


// Todo List By status start
exports.TodoListByStatus = async (req, res) => {
    try {
        let status = req.params.status
        let email = req.headers.email

        const result = await TodoModel.aggregate(
            [
                { $match: {status: status , email: email}},
                {$project: { _id: 1, title: 1, description: 1, status: 1, createdDate:{ $dateToString: { format: "%d-%m-%Y", date: "$createdDate"} }} }
            ]
        )

        res.status(200).json({ status: "success", data: result })


    }
    catch (error) {
        res.status(200).json({ status: "fail", data: error })
    }
}
// Todo List By status edn


// Todo Cout By status start
exports.TodoCountByStatus = async (req, res) => {
    try {
        let email = req.headers.email

        const result = await TodoModel.aggregate(
            [
                {$match: {email: email}},
                {$group: { _id: "$status", count: {$count: {}} }}
            ]
        )

        res.status(200).json({ status: "success", data: result })
    }

    catch (error) {
        res.status(200).json({ status: "fail", data: error })
    }
}
// Todo Cout By status End





















