const { Publication } = require('../database');
const BookModel = require('../schema/book');
const PublicationModel = require('../schema/publication');

const Router = require('express').Router();

//--------------------GET ROUTE---------------------------//

//Route - /publication
//Description -  to get all publications
//Access - Public
//Method - GET
//Params - none


Router.get("/",async (req,res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json(getAllPublications);
});
//Route - /publication/:publicationID
//Description - to get specific publication
//Access - Public
//Method - GET
//Params - publicationID


Router.get("/:publicationID",async (req,res) => {

    const id = req.params.publicationID;

    const getSpecificPublication = await PublicationModel.findOne({id: parseInt(id)});

    if(!getSpecificPublication){
        return res.json({
            error: `No publication found for the id of ${parseInt(id)}`
        });
    }

    return res.json({publication: getSpecificPublication}); 
});

//Route - /publication/b/:bookISBN
//Description -  to get a list of publication based on a book.
//Access - Public
//Method - GET
//Params - bookISBN


Router.get("/p/:bookISBN",async (req,res) => {

    const getPublication = await PublicationModel.find({books: req.params.bookISBN});
    
    if(!getPublication){
        return res.json({error: `No publication found for the book of ${req.params.bookISBN}`});
    }

    return res.json({publication : getPublication})
});

//--------------------POST ROUTE---------------------------//






//Route - /publication/new
//Description -  to add new publication
//Access - Public
//Method - POST
//Params - none


Router.post("/new",async (req,res) => {
    try{
        const {newPublication} = req.body;
        await PublicationModel.create(newPublication);
        return res.json({message: 'Publication added to the database'});
    }catch(error){
        return res.json({error: error.message});
    }
});

//--------------------PUT ROUTE---------------------------//

//Route - /book/update/:ISBN
//Description -  update any details of the publication
//Access - Public
//Method - PUT
//Params - ISBN


Router.put("/updatepubname/:id",async (req,res) => {
    const ID = req.params.id;
    const {name} = req.body;
    const updatePublication = await PublicationModel.findOneAndUpdate(
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
    return res.json({publication: updatePublication});
});

//Route - /updateBook/:ID
//Description - to update/add new book
//Access - Public
//Method - PUT
//Params - none


Router.put("/updateBook/:ID",async (req,res) => {
    const {newBook} = req.body;
    const {ID} = req.params;

    const updatePublication = await PublicationModel.findOneAndUpdate(
        {
            id: parseInt(ID),
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
            ISBN: newBook,
        },
        {
            publication:parseInt(ID),
        },
        {
            new: true,
        }
    );

   return res.json({publications: updatePublication , books: updateBook , message: 'New book was added into the database' });
});



//--------------------DELETE ROUTE---------------------------//




//Route - /publication/delete/:id
//Description -  delete a publication 
//Access - Public
//Method - DELETE
//Params - id


Router.delete("/delete/:ID",async (req,res) => {
    const {ID} = req.params;

    const updatePublicationDatabase = await PublicationModel.findOneAndDelete({
        id: ID
    });
    return res.json({publication: updatePublicationDatabase});
});


//Route - /publication/delete/book
//Description -  delete a book from a publication
//Access - Public
//Method - DELETE
//Params - ISBN, id


Router.delete("/delete/book/:isbn/:ID",async (req,res) => {

    const {isbn, ID} = req.params;

    const updatePublication = await PublicationModel.findOneAndUpdate({
        id : parseInt(ID)
    },
    {
        $pull: {
            books: isbn,
        }
    },
    {
        new: true,

    });

    const updateBook = await BookModel.findOneAndUpdate(
        {
            ISBN : isbn,
        },
        {
           publication: 0,
        },
        {
            new: true,
        }, 
    );

        return res.json({message : 'Book was deleted', publication : updatePublication , book : updateBook});
});


module.exports = Router;