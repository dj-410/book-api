const AuthorModel = require('../schema/author');
const BookModel = require('../schema/book');

const Router = require('express').Router();

//--------------------GET ROUTE---------------------------//

//Route - /author
//Description -  to get all authors
//Access - Public
//Method - GET
//Params - none


Router.get("/",async (req,res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
});

//Route - /author/:authorID
//Description - to get specific author
//Access - Public
//Method - GET
//Params - authorID


Router.get("/:authorID",async (req,res) => {

    const id = req.params.authorID;

    const getSpecificAuthor = await AuthorModel.findOne({id: parseInt(id)});

    if(!getSpecificAuthor){
        return res.json({
            error: `No author found for the id of ${parseInt(id)}`
        });
    }

    return res.json({author: getSpecificAuthor}); 
});

//Route - /author/b/:bookISBN
//Description -  to get list of author based on a book
//Access - Public
//Method - GET
//Params - bookISBN


Router.get("/b/:bookISBN",async (req,res) => {

    const getAuthor = await AuthorModel.find({books: req.params.bookISBN});
    
    if(!getAuthor){
        return res.json({error: `No author found for the book of ${req.params.bookISBN}`});
    }

    return res.json({author : getAuthor})
});

//--------------------POST ROUTE---------------------------//

//Route - /author/new
//Description -  to add new author
//Access - Public
//Method - POST
//Params - none


Router.post("/new",async (req,res) => {
    try{
        const {newAuthor} = req.body;
        await AuthorModel.create(newAuthor);
        return res.json({message: 'Author added to the database'});
    }catch(error){
        return res.json({error: error.message});
    }
});



//--------------------PUT ROUTE---------------------------//

//Route - /author/updateName/:id
//Description -  update any details of the author
//Access - Public
//Method - PUT
//Params - id


Router.put("/updateName/:id",async (req,res) => {
    const ID = req.params.id;
    const {name} = req.body;
    const updateAuthor = await AuthorModel.findOneAndUpdate(
    {
        id: parseInt(ID),
    },
    {
        name: name,
    }, 
    {
        new: true,
    }
);
    return res.json({author: updateAuthor});
});

//Route - /updateBook/:isbn
//Description - to update/add new book
//Access - Public
//Method - PUT
//Params - none


Router.put("/updateBook/:ID",async (req,res) => {
    const {newBook} = req.body;
    const {ID} = req.params;

    const updateAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: ID,
        },
        {
            $addToSet:{
                books: newBook,
            },
        },
        {
            new: true,
        }
    );

    const updateBook = await BookModel.findOneAndUpdate(
        {
            ISBN: newBook
        },
        {
            $addToSet:{
                authors: ID,
            },
        },
        {
            new: true,
        }
    );

   return res.json({authors: updateAuthor , books: updateBook , message: 'New book was added into the database' });
});


//--------------------DELETE ROUTE---------------------------//


//Route - /author/delete/:id
//Description -  delete an author
//Access - Public
//Method - DELETE
//Params - id


Router.delete("/delete/:ID",async (req,res) => {
    const {ID} = req.params;

    const updateAuthorDatabase = await AuthorModel.findOneAndDelete({
        id: ID
    });
    return res.json({author: updateAuthorDatabase});
});

module.exports = Router;