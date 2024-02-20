import { config } from "dotenv";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const books = [
  {
    id: 1,
    title: "The Awakening",
    author: "Kate Chopin",
    stock: 2,
  },
  {
    id: 2,
    title: "City of Glass",
    author: "Paul Auster",
    stock: 13,
  },
  {
    id: 3,
    title: "The Great Gatsby",
    author: "Paul Auster",
    stock: 23,
  },
];

const authors = [
  {
    id: 1,
    book: "The Awakening",
    name: "Kate Chopin",
  },
  {
    id: 2,
    book: "City of Glass",
    name: "Paul Auster",
  },
  {
    id: 3,
    book: "The Great Gatsby",
    name: "Paul Auster",
  },
];

const typeDefs = `
    type Book {
        id: ID,
        title: String,
        author: String,
        stock: Int
    }

    type Author {
        id: ID,
        name: String,
        book: String
    }

    type Query {
        books: [Book],
        book(id: ID): Book,
        authors: [Author],
        author(id: ID): Author
    }

    type Mutation {
        addBook(title: String, author: String, stock: Int): Book,
        updateBook(id: ID, title: String, author: String, stock: Int): Book,
        deleteBook(id: ID): Book
        addAuthor(name: String, book: String): Author
    }
`;

const resolvers = {
  Query: {
    books: () => books,
    book: (__: void, args: any) => {
      return books.find((book) => book.id == args.id);
    },
    authors: () => authors,
    author: (__: void, args: any) => {
      return authors.find((author) => author.id == args.id);
    },
  },
  Mutation: {
    addBook: (__: void, args: any) => {
      const newBook = {
        id: books.length + 1,
        title: args.title,
        author: args.author,
        stock: args.stock,
      };
      books.push(newBook);
      return newBook;
    },
    updateBook: (__: void, args: any) => {
      const bookIndex = books.findIndex((book) => book.id == args.id);
      books[bookIndex] = {
        id: args.id,
        title: args.title,
        author: args.author,
        stock: args.stock,
      }
      return books[bookIndex];
    },
    deleteBook: (__: void, args: any) => {
      const bookIndex = books.findIndex((book) => book.id == args.id);
      const deletedBook = books[bookIndex];
      books.splice(bookIndex, 1);
      return deletedBook;
    },
    addAuthor: (__: void, args: any) => {
      const newAuthor = {
        id: authors.length + 1,
        name: args.name,
        book: args.book,
      };
      authors.push(newAuthor);
      return newAuthor;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

(async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
  });
  console.log(`Server ready at ${url}`);
})();
