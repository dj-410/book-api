const BookModel = require('../schema/book');
const AuthorModel = require('../schema/author');

const Router = require('express').Router();


//--------------------GET ROUTE---------------------------//

//Route - /book
//Description - To get all books
//Access - Public
//Method - GET
//Params - none


Router.get("/",async (req,res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

//Route - /book/:bookID
//Description - To get a book based on ISBN
//Access - Public
//Method - GET
//Params - bookID


Router.get("/:bookID",async (req,res) => {
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.bookID});

    if(!getSpecificBook){
        return res.json({
            error: `No book found for the ISBN of ${req.params.bookID}`
        });
    }

    return res.json({book: getSpecificBook});
});

//Route - /book/c/:category
//Description -  to get a list of books based on category
//Access - Public
//Method - GET
//Params - category


Router.get("/c/:category",async (req,res) => {
    const getSpecificBooks = await BookModel.find({category: req.params.category});
    
    if(!getSpecificBooks){
        return res.json({error: `No book found for the category of ${req.params.category}`});
    }

    return res.json({books: getSpecificBooks});
});

//Route - /book/a/:author
//Description -  to get a list of books based on authors
//Access - Public
//Method - GET
//Params - authorID


Router.get("/a/:author",async (req,res) => {

    const id = req.params.author;

    const getSpecificBooks = await BookModel.find({authors: parseInt(id)});
    
    if(!getSpecificBooks){
        return res.json({error: `No book found for the author of ${parseInt(id)}`});
    }

    return res.json({books: getSpecificBooks});
});


//--------------------POST ROUTE---------------------------//

//Route - /book/new
//Description -  add new book
//Access - Public
//Method - POST
//Params - none


Router.post("/new",async (req,res) => {
    try{
        const {newBook} = req.body;
        await BookModel.create(newBook);
        return res.json({message: 'Book added to the database'});

    }catch(error){
        return res.json({error: error.message});
    }
});

//--------------------PUT ROUTE---------------------------//

//Route - /book/update/:ISBN
//Description -  update any details of the book
//Access - Public
//Method - PUT
//Params - ISBN


Router.put("/update/:ISBN",async (req,res) => {
    const {title,language} = req.body;
    const updateBook = await BookModel.findOneAndUpdate(
    {
        ISBN: req.params.ISBN,
    },
    {
        title: title,
        language : language,
    }, 
    {
        new: true,
    }
);
    return res.json({book: updateBook});
});


//Route - /book/updateAuthor/:ISBN
//Description -  update/add new author to a book
//Access - Public
//Method - PUT
//Params - ISBN


Router.put("/updateAuthor/:isbn",async (req,res) => {
    const {newAuthor} = req.body;
    const {isbn} = req.params;

    const updateBook = await BookModel.findOneAndUpdate(
        {
            ISBN: isbn
        },
        {
            $addToSet:{
                authors: newAuthor,
            },
        },
        {
            new: true,
        }
    );

    const updateAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: newAuthor
        },
        {
            $addToSet:{
                books: isbn,
            },
        },
        {
            new: true,
        }
    );

   return res.json({books: updateBook , authors: updateAuthor , message: 'New author was added into the database' });
});

//--------------------DELETE ROUTE---------------------------//

//Route - /book/delete/:ISBN
//Description -  delete a book
//Access - Public
//Method - DELETE
//Params - ISBN


Router.delete("/delete/:isbn",async (req,res) => {
    const {isbn} = req.params;

    const updateBookDatabase = await BookModel.findOneAndDelete({
        ISBN: isbn
    })

    return res.json({books: updateBookDatabase});
}); 

//Route - /book/delete/author/:ISBN/:ID
//Description -  delete an author from a book
//Access - Public
//Method - DELETE
//Params - ISBN, authorid


Router.delete("/delete/author/:isbn/:ID",async (req,res) => {

    const {isbn, ID} = req.params;

    const updateBook = await BookModel.findOneAndUpdate({
        ISBN:isbn
    },
    {
        $pull: {
            authors: parseInt(ID),
        }
    },
    {
        new: true,

    });

    const updateAuthor = await AuthorModel.findOneAndUpdate(
        {
            id:parseInt(ID),
        },
        {
            $pull:{
                books: isbn,
            },
        },
        {
            new: true,
        },
    );

        return res.json({message: 'Author was deleted',book: updateBook , author: updateAuthor} );
});

module.exports = Router;